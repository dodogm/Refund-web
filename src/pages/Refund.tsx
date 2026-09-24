import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { ZodError, z } from "zod"

import { AxiosError, isAxiosError } from "axios"
import fileSVG from "../assets/file.svg"
import { Input } from "../components/Input"
import { Select } from "../components/Select"
import { Upload } from "../components/Upload"

import { CATEGORIES, CATEGORIES_KEYS } from "../utils/categories"
import { Button } from "../components/Button"
import { api } from "../services/api"
import { formatCurrency } from "../utils/formatCurrency"


const refundSchema = z.object({
    name: z.string().min(3, {message: "Informe um nome claro para sua solicitação"}),
    category: z.enum(CATEGORIES_KEYS, {message: "Informe uma categoria válida"}),
    amount: z.coerce.number({message: "Informe um valor válido"})
    .positive({message: "Informe um valor válido e superior a 0"}),
})

const uploadedFilenameSchema = z.string().min(20, {
    message: "O comprovante enviado é inválido. Selecione o arquivo novamente.",
})

type ApiErrorResponse = {
    message?: unknown
    issues?: unknown
}

function getFirstValidationMessage(issues: unknown): string | undefined {
    if (!issues || typeof issues !== "object") {
        return undefined
    }

    const { _errors, ...fields } = issues as Record<string, unknown>

    if (Array.isArray(_errors)) {
        const message = _errors.find((error): error is string => typeof error === "string")

        if (message) {
            return message
        }
    }

    for (const fieldIssues of Object.values(fields)) {
        const message = getFirstValidationMessage(fieldIssues)

        if (message) {
            return message
        }
    }
}

function getApiErrorMessage(error: AxiosError<unknown>) {
    const data = error.response?.data

    if (data && typeof data === "object") {
        const { message, issues } = data as ApiErrorResponse

        return getFirstValidationMessage(issues)
            ?? (typeof message === "string" ? message : "Não foi possível realizar a solicitação")
    }

    return "Não foi possível realizar a solicitação"
}

export function Refund() {
    const [name, setName] = useState("")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [file, setFile] = useState<File | null>(null)
      const [fileURL, setFileURL] = useState<string | null>(null)

    const navigate = useNavigate()
    const params = useParams<{id: string}>()

   async function onSubmit(e: React.FormEvent) {
        e.preventDefault()

        if(params.id) {
            return navigate(-1)
        }

        try {
            setIsLoading(true)

            if (!file) {
                return alert("Selecione  um arquivo  de comprovante")                
            }

            const fileUploadForm = new FormData()
            fileUploadForm.append("file", file)

            const response = await api.post("/uploads", fileUploadForm)
            const filename = uploadedFilenameSchema.parse(response.data)

            const data = refundSchema.parse({
                name, category, amount: amount.replace("," , "."),
            })

            await api.post("/refunds", {...data, filename})
            

            navigate("/confirm", { state: {fromSubmit: true}})

        } catch (error) {
            console.log(error)

            if(error instanceof ZodError) {
                return alert(error.issues[0].message)
            }

            if(isAxiosError(error)) {
                return alert(getApiErrorMessage(error))
            }

            alert("Não foi possível realizar a solicitação")

        } finally {
            setIsLoading(false)
        }
    }

    async function fetchRefund(id:string) {
        try {
            const { data } = await api.get<RefundAPIResponse>("/refunds/" + id)
            setName(data.name)
            setCategory(data.category)
            setAmount(formatCurrency(data.amount))
            setFileURL(data.filename)

            console.log(fileURL)
        } catch (error) {
            console.log(error)
            
            if (error instanceof AxiosError) {
                return alert(error.response?.data.message)
            }

            alert("Não foi possível carregar")
        }
    }

    useEffect (() => {
        if (params.id) {
            fetchRefund(params.id)            
        }
    }, [params.id]
)

    return (
        <form
         className="bg-gray-500 w-full rounded-xl flex flex-col p-10 gap-6 lg:min-w-[512px]"
          onSubmit={onSubmit}>
            <header>
                <h1 className="text-xl font-bold text-gray-100">Solicitação de reembolso</h1>

                <p className="text-sm text-gray-200 mt-2 mb-4">Dados da despesa para solicitar reembolso</p>
            </header>

            <Input 
            required
             legend="Nome da solicitação" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            disabled={!!params.id}
            />

<div className="flex gap-4">
            <Select required
             legend="Categoria"
              value={category} 
              disabled={!!params.id}
            onChange={(e) => setCategory(e.target.value)}>
                {
                    CATEGORIES_KEYS.map((category) => (
                        <option key={category} value={category}>
                            {CATEGORIES[category].name}
                        </option>

                    ))}
                    
            </Select>

            <Input legend="Valor" required
             value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            disabled={!!params.id}
            />

            </div>

            {params.id && fileURL ? (
                <a href={"https://refund-api-13uj.onrender.com/uploads/" + fileURL}
                 target="_blanck"
                className="text-sm text-green-100 font-semibold flex items-center justify-center gap-2 my-6 hover:opacity-70 transition ease-linear">
                
                   <img src={fileSVG} alt="Ícone do arquivo" /> Abrir comprovante
                </a>
            ) : 

            (<Upload
            filename={file && file.name}
            onChange={(e) => e.target.files && setFile(e.target.files[0])}
           /> )}

            <Button type="submit" isLoading={isLoading}> {params.id ? "Voltar" : "Enviar"}</Button>


            
        </form >
    )
}
