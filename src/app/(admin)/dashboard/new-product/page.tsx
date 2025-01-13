import dynamic from 'next/dynamic'

const NewProductForm = dynamic(() => import('./NewProductForm'), { 
  ssr: false,
})

export default function NewProductPage() {
  return (
    <div className='flex flex-col items-center'>
      <h1 className="text-2xl font-bold my-6 uppercase">Create a new product</h1>
      <NewProductForm />
    </div>
  )
}

