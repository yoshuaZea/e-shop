export const formatearDinero = cantidad => {
    return Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2
            }).format(cantidad)
}