"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { create } from "domain";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select,SelectContent,SelectItem,SelectTrigger, SelectValue } from "./ui/select";


const emps = [
    {
        id: "E01",
        firstname: "Jo",
        lastname: "Jake",
        phone: "084135132",
        createdAt: "2021-09-01",
        position: "แคชเชียร์",
        salary: "15000",
    },
    {
        id: "E02",
        firstname: "Jo",
        lastname: "Jake",
        phone: "084135132",
        createdAt: "2021-09-01",
        position: "ครัว",
        salary: "15000",
    },

]




// Validation schema for the form
const customerFormSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    customerPhone: z.string().min(1, "Phone number is required"),
    cusCreatedAt: z.date({
        required_error: "Please select a date",
    }),
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

export default function CustomerForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    const [date, setDate] = React.useState<Date>()


    // Initialize the form with default values
    const form = useForm<CustomerFormValues>({
        resolver: zodResolver(customerFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            customerPhone: "",
            cusCreatedAt: new Date(),
        },
    });

    // Submit handler
    async function onSubmit(data: CustomerFormValues) {


        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            // Here you would typically call your API endpoint to save the data
            console.log("Form submitted with data:", data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Success state
            setSubmitResult({
                success: true,
                message: "Customer information saved successfully!"
            });

            // Reset form after successful submission
            form.reset();
        } catch (error) {
            // Error state
            setSubmitResult({
                success: false,
                message: "Failed to save customer information. Please try again."
            });
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full mx-auto p-10 ">

            <Dialog>
                <div className="flex justify-between items-center">
                    <h2 className="text-4xl mb-0 font-bold">จัดการพนักงาน</h2>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="primarybg py-5">เพื่มพนักงาน</Button>
                    </DialogTrigger>
                </div>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>เพื่มพนักงาน</DialogTitle>
                        <DialogDescription>
                            เพิ่มข้อมูลพนักงานใหม่ กรุณากรอกให้ครบทุกช่อง
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="firstname" className="text-right">
                                First Name
                            </Label>
                            <Input id="firstname" className="col-span-3" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastname" className="text-right">
                                Last Name
                            </Label>
                            <Input id="lastname" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastname" className="text-right">
                                Phone Number
                            </Label>
                            <Input id="lastname" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="station" className="text-right">
                                ตำแหน่ง
                            </Label>
                            <Select >
                                <SelectTrigger className="w-full  col-span-3">
                                    <SelectValue placeholder="เลือกตำแหน่ง..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="แคชเชียร์">แคชเชียร์</SelectItem>
                                    <SelectItem value="เสิร์ฟ">เสิร์ฟ</SelectItem>
                                    <SelectItem value="ครัว">ครัว</SelectItem>
                                    <SelectItem value="ล้างจาน">ล้างจาน</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastname" className="text-right">
                                เงินเดือน
                            </Label>
                            <Input id="salary" className="col-span-3" />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="lastname" className="text-right">
                                วันที่เพิ่ม
                            </Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal col-span-3",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                    </div>

                    <DialogFooter>
                        <Button type="submit" className="primarybg hover:bg-[#e797e1]">  {isSubmitting ? "Saving..." : "บันทึกพนักงานใหม่"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {submitResult && (
                <div
                    className={`p-4 mb-6 rounded-md ${submitResult.success
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                >
                    {submitResult.message}
                </div>
            )}



            <div className="mt-10">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>First Name</TableHead>
                            <TableHead>Last Name</TableHead>
                            <TableHead >Phone number</TableHead>
                            <TableHead >ตำแหน่ง</TableHead>
                            <TableHead >เงินเดือน</TableHead>
                            <TableHead>วันที่เพิ่ม</TableHead>
                            <TableHead className="text-center w-[150px]">การจัดการ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {emps.map((emp) => (
                            <TableRow key={emp.id}>
                                <TableCell className="font-medium">{emp.id}</TableCell>
                                <TableCell className="font-medium">{emp.firstname}</TableCell>
                                <TableCell>{emp.lastname}</TableCell>
                                <TableCell>{emp.phone}</TableCell>
                                <TableCell>{emp.position}</TableCell>
                                <TableCell>{emp.salary}</TableCell>
                                <TableCell >{emp.createdAt}</TableCell>
                                <TableCell className="text-center"><Button variant="destructive">ลบ</Button></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </div>

        </div>
    );
}