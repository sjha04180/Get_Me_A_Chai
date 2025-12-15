import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <div style={{ backgroundImage: 'linear-gradient(90deg,rgba(6, 22, 33, 1) 0%, rgba(7, 22, 34, 1) 50%, rgba(8, 23, 34, 1) 100%)' }} className='text-white flex justify-center items-center py-4 text-center'>
            <p>Copyright &copy; {currentYear} Get me A Chai - All rights reserved</p>
        </div>
    )
}

export default Footer
