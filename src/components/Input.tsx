
type Props = React.ComponentProps<"input"> & {
    legend?: string
}

export function Input({ legend, type = "text", ...rest }: Props) {
    return (
        <fieldset className="flex flex-1 max-h-20 focus-within:text-green-100 text-gray-200">
            {legend && <legend className="uppercase text-xxs  mb-2 text-inherit">{legend}</legend>}

            <input type={type} className="w-full h-12 rounded-lg border border-gray-300 px-4 text-sm text-gray-200 bg-transparent outline-none focus:border-1 focus:border-green-100" {...rest} />
        </fieldset>
    )
}