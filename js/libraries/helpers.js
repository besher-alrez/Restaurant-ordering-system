export function formatting_numeric(value) {
    return (
        String(value)
            // remove non numerical chars
            .replace(/\D/g, '')
            // remove any zeros in the beginning
            .replace(/^0/g, '')
    )
}
