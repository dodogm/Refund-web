import React, { useState, useEffect } from "react"
import { AxiosError } from "axios"

import { api } from "../services/api"

import searchSvg from "../assets/search.svg"
import { CATEGORIES } from "../utils/categories"
import { formatCurrency } from "../utils/formatCurrency"

import { Button } from "../components/Button"
import { Input } from "../components/Input"
import { RefundItem, type RefundItemProps } from "../components/RefundItems"
import { Pagination } from "../components/Pagination"



const PER_PAGE = 3
export function Dashboard() {
    const [name, setName] = useState("")
    const [page, setPage] = useState(1)
    const [totalPage, setTotalPage] = useState(0)
    const [refunds, setRefunds] = useState<RefundItemProps[]>([])

    async function fetchRefunds() {
        try {
            const response = await api.get<RefundPaginationAPIResponse>("/refunds?name=" + name.trim() + "&page=" + page + "&perPage=" + PER_PAGE)
        
        setRefunds(
            response.data.refunds.map((refund) => ({
            id: refund.id,
             name: refund.user.name,
             category: refund.name,
             amount: formatCurrency(refund.amount),
             categoryImg: CATEGORIES[refund.category].icon,
    }))
        )

        setTotalPage(response.data.pagination.totalPages)
        } catch (error) {
            console.log(error)

            if (error instanceof AxiosError) {
                return alert(error.response?.data.message)
            }

            alert("Não foi possível carregar")
        }   
    }

    function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        fetchRefunds()
    }

    function handlePagination(action: "next" | "previous") {
        setPage (prevPage => {
            if(action === "next" && prevPage < totalPage) {
                return ++prevPage }

                 if(action === "previous" && prevPage > 1) {
                return --prevPage }

                return prevPage
        })
    }

    useEffect(() => {
        fetchRefunds()
    })

    return (
        <div className="bg-gray-500 rounded-xl p-10 md:min-w-[768px]">
        <h1 className="text-gray-100  font-bold text-lg flex-1">Solicitações</h1>

        <form
         onSubmit={onSubmit} 
         className="flex flex-1 items-center justify-between pb-6 border-b-[1px] border-b-gray-400 md:flex-row gap-2 mt-6">
            
            <Input
            placeholder="Pesquisar pelo nome"
            onChange= {(e) => setName(e.target.value)}
            />

            <Button type="submit" variant="icon">
                <img src={searchSvg} alt="Ícone de pesquisar" className="w-5" />
            </Button>
        </form>

        <div className="my-6 flex flex-col gap-4 max-h-[342px] overflow-y-scroll">
        {refunds.map((item) => (
            <RefundItem key={item.id} data={item} href={"/refund/" + (item.id)}/>
        ))}
           
        </div>

        <Pagination
        current={page}
        total={totalPage}
        onNext={() => handlePagination("next")}
        onPrevious={() => handlePagination("previous")}/>
        </div>
    )
}