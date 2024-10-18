import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import SuccessImage from "/Successfully Done.gif"
const SuccessPage = () => {
    const {width,height} = useWindowSize()
  return (
    <div className='flex items-center justify-center h-screen overflow-hidden'>
        <Confetti width={width} height={height}  className=''/>
      <img src={SuccessImage} alt="" className='w-40 h-40'/>
    </div>
  )
}

export default SuccessPage
