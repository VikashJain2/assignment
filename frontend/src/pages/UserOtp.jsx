"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

const UserOtp= ()=> {

    const navigate = useNavigate()
    const userId = location.pathname.split("/")[2]
    useEffect(()=>{
        console.log(userId);
        
    })
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  const onSubmit= async(data)=> {
    const otpData = {
        ...data,
        userId
    }
    console.log(otpData);
    
   try {
     const response = await axios.post("http://localhost:4000/api/user/verifyOtp",otpData)
 
     if(response.data.success){
         toast.success("OTP verified successfully")
         navigate(`/success/${userId}`)
     }else{
         toast.error(response.data.message)
     }
   } catch (error) {
    console.log(error);
    
   }
  }

  return (
    <div className="flex items-center justify-center h-screen">
        <div className="shadow-md p-5">

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-rose-500">Submit</Button>
      </form>
    </Form>
          </div>
          </div>
  )
}
export default UserOtp;
