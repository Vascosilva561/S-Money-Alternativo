type props = {page:string}

export default function Direction({page}:props){


    return (
        <div className=" text-[#143163] pb-5 top-24">
                <p className="text-xl font-bold text-[#143163]">Gestão</p>
                <div className="flex space-x-1">
                    <p className="  text-[#143163]">Dashboard</p>
                    <p className="  text-[#17CFDA]">{">"}</p>
                    <p className="  text-[#143163]">{page}</p>
                </div>
            </div>
    )
}