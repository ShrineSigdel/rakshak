"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useState } from "react"

const formSchema = z.object({
    accidentType: z.enum(["vehicle", "damagedroad", "landslide", "flood", "other"]),
    description: z.string().min(10, "Description must be at least 10 characters."),
    date: z.date()
})

interface AccidentReportFormProps {
    onClose: () => void;
    coordinates: [number, number];
}

const AccidentReportForm: React.FC<AccidentReportFormProps> = ({ onClose, coordinates }) => {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            date: new Date(),
            accidentType: "vehicle"
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch('/api/accidents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    coordinates,
                    timestamp: new Date().toISOString()
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to submit report')
            }

            setIsSubmitted(true) // Set submission status
            setTimeout(onClose, 2000) // Close form after 2 seconds for feedback display
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Accident Report Form</CardTitle>
                <CardDescription>Please fill out the details of the accident below.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="accidentType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type of Accident</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select accident type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="vehicle">Vehicle Accident</SelectItem>
                                            <SelectItem value="damagedroad">Damaged Road / Potholes</SelectItem>
                                            <SelectItem value="landslide">Landslide</SelectItem>
                                            <SelectItem value="flood">Flood</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description of Accident</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Please provide a detailed description of what happened."
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Submit Report</Button>
                        {isSubmitted && <p className="text-green-500 mt-2 px-1">Report submitted successfully!</p>}
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

export default AccidentReportForm
