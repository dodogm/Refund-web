import { useActionState } from "react"
import { z, ZodError} from "zod"
import { AxiosError } from "axios"

import { api } from "../services/api"
import { useAuth } from "../hooks/useAuth"

import { Input } from "../components/Input"
import { Button } from "../components/Button"

const signInScheme = z.object ({
    email: z.string().email({message: "E-mail inválido."}),
    password: z.string().trim().min(1, {message: "Informe a senha."})
})

export function SignIn() {
    const [, formAction, isLoading] = useActionState(onAction, null)

    const auth = useAuth()

   async function onAction(_: any, formData: FormData) {

    try {
       const data = signInScheme.parse({
        email: formData.get("email"),
        password: formData.get("password"),
    })

    const response = await api.post("/sessions", data)
    auth.save(response.data)

    } catch (error) {
        console.log(error)

        if (error instanceof ZodError) {
            
            return alert(error.issues[0].message)
        }

         if (error instanceof AxiosError) {
            
            return alert(error.response?.data.message)
        }

        return alert("Não foi possível entrar")
    }
}

    return (
        <form action={formAction} className="w-full flex flex-col gap-4">
            <Input
            name="email"
                required
                legend="E-mail"
                type="email"
                placeholder="seu@email.com"                
            />

            <Input
            name="password"
                required
                legend="Senha"
                type="password"
                placeholder="Abc123@"                
            />

            <Button type="submit" isLoading={isLoading}>
                Entrar
                </Button>

                <a href="/signup" className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 transition ease-linear">Criar conta</a>

        </form>
    )
}