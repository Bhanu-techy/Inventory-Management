

function ProductRow({product, onClickEdit, onViewHistory}) {
   

    const status = product.stock === 0 ? 'Out of Stock' : 'In Stock';
    const colorClass = product.stock === 0 ? 'text-red-600' : 'text-green-600';

  return (
    <tr key={product.id}>
            <td className="py-2 px-4 border">{product.name}</td>
            <td className="py-2 px-4 border">{product.brand}</td>
            <td className={`py-2 px-4 border ${colorClass}`}>{status}</td>
           <td className='py-2 px-4 border flex justify-around w-[190px]'>
             <button type="button" className="bg-green-400 w-[50px] rounded text-white" onClick={()=>onClickEdit(product.id)}>
                  Edit
                </button>
              <button className='bg-blue-400 w-[100px] rounded' onClick={()=>onViewHistory(product.id)}>View History</button>
            </td>
    </tr>
  )
}

export default ProductRow