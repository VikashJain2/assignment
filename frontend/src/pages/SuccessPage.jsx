import React, { useEffect, useState } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import SuccessImage from "/Successfully Done.gif"
import axios from 'axios'
import toast from 'react-hot-toast'
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { Switch } from "@/components/ui/switch"
import { useForm } from 'react-hook-form'
const SuccessPage = () => {
    const [userInfo,setUserInfo] = useState()
    const [is2FA,set2FA] = useState(true)
  const userId = location.pathname.split("/")[2]
    const fetchUser = async()=>{
      try {
        const response = await axios.post("http://localhost:4000/api/user/user-info",{userId})

        if(response.data.success){
          setUserInfo(response.data.fetchUser)
          set2FA(response.data.fetchUser.is2FAEnable)
          console.log(userInfo);
          
        }else{
          toast.error("Failed to fetch user info")
        }
      } catch (error) {
        console.log(error);
        
      }
    }
    const form = useForm({
      defaultValues: {
        set2FA: is2FA
        
      }
    })

    const onSubmit = async(data)=>{
      const updatedData = {
        ...data,
        userId
      }
      try {
        const response = await axios.post("http://localhost:4000/api/user/set2FA",updatedData)

        if(response.data.success){
          toast.success(response.data.message)
          set2FA(response.data.set2FA)
        }
        else{
          toast.error(response.data.message)
        }
      } catch (error) {
        console.log(error);
        
      }
      
    }
    useEffect(()=>{
      // console.log(userId);
      
      fetchUser()
    },[])
  return (
    <div className='flex items-center justify-center h-screen overflow-hidden'>
    <div className='shadow-sm p-5 gap-5'>
      {userInfo ? (
        <>
          <div className='flex items-center'>
            <span className='text-rose-500'>UserName: {" "}</span>{" "}<p>{userInfo.name}</p>
          </div>

          <div className='flex items-center'>
            <span className='text-rose-500'>Email: {" "}</span>{" "}<p>{userInfo.email}</p>
          </div>
          <div className='flex items-center'>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium">2 Fector authentication</h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="set2FA"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
           
            
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
          </div>
          
        </>
      ) : (
        <p>Loading...</p> // You can show a loading message or spinner here
      )}
    </div>
  </div>
  )
}

export default SuccessPage
