import { Alert, AlertTitle } from "@/components/ui/alert"

export default function CustomAlert({ message }) {
    return(
            <Alert className="absolute w-sm top-10 animate-bounce">
                <AlertTitle className="text-center">{message}</AlertTitle>
            </Alert>
    )
}