document.addEventListener("DOMContentLoaded",()=>{cart.init();})

var cart=
{
    articulos:0,
    detalle:null,
    data_cart:null,
    decimales_importe:6,
    cant_prod_item:null,
    init()
    {
        this.body_detalle=document.getElementById("body_detalle");
        this.counter_cart=document.getElementById("counter_cart");
        this.subtotal=document.getElementById("subtotal");
        this.impuestos=document.getElementById("impuestos");
        this.descuento=document.getElementById("descuento");
        this.total=document.getElementById("total");

        if(this.articulos > 0)this.SetValue(this.counter_cart,this.articulos);

        this.detalle_HTML=`<tbody>
                            <tr>
                                <td>@producto</td>
                                <td>@precio</td>
                                <td>@cantidad</td>
                                <td>
                                    <div class="btn-group btn-group-sm" role="group">
                                        <button type="button" class="btn border text-secondary fw-bold" onclick="cart.ActQuit(@pedido,@pk_producto)">-</button>
                                            <div class="px-2 border-top border-bottom d-flex align-items-center">
                                                <small id="cant_@pedido">@cantidad</small>
                                            </div>
                                        <button type="button" class="btn border text-secondary fw-bold" onclick="cart.ActAdd(@pedido,@pk_producto)">+</button>
                                    </div>
                                    <button type="button" class="btn border text-secondary fw-bold m-0" title="Eliminar" onclick="cart.ActDel(@pedido,@pk_producto)" style="padding: 2px;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                    </svg>
                                </button>
                                </td>
                            </tr>
                            </tbody`;

        if(this.detalle)this.PrintDetalleCart(this.detalle);
        if(this.data_cart?.totales)cart.PrinTotales(this.data_cart.totales);
    },
    ActDel(sys_pk,producto)
    {
        cart.AddCart(producto,-9999999);
    },
    ActAdd(sys_pk,producto)
    {
        var cant_=document.getElementById("cant_"+sys_pk);

        cart.AddCart(producto,1);
    },
    ActQuit(sys_pk,producto)
    {
        var cant_=document.getElementById("cant_"+sys_pk);

        cart.AddCart(producto,-1);
    },
    AddCart(sys_pk,cantidad=1)
    {
        var data=
        {
            producto:sys_pk,
            agregar:cantidad
        }
        this.InvokeService(cart.url_update_cart,data,
        (success)=>
        {
            if(success.totales)
            {
                cart.SetValue(cart.counter_cart,(success.totales.articulos??0));
                cart.PrinTotales(success.totales);
            }
            if(success.detalle)cart.PrintDetalleCart(success.detalle);
        },
        (fail)=>{alert(fail.message??JSON.stringify(fail));})
    },
    SetValue(element,value)
    {
        if(element)
        {
            if(element.value)element.value=value;
            else element.innerHTML=value;
        }
    },
    PrintDetalleCart(data)
    {
        if(!data || !this.body_detalle)return;

        if(this.body_detalle)this.body_detalle.innerHTML="";
        for (let i = 0; i < data.length; i++) 
        {
            const element = data[i];
            this.PrintItem(element);
        }
    },
    PrinTotales(totales)
    {
        if(this.subtotal)this.subtotal.innerHTML="$ " +totales.subtotal;
        if(this.impuestos)this.impuestos.innerHTML="$ " +totales.impuestos;
        if(this.descuento)this.descuento.innerHTML="$ " +totales.descuentos;

        if(this.total)this.total.innerHTML="$ " + this.round((totales.subtotal + totales.impuestos) - totales.descuentos,this.decimales_importe);
    },
    PrintItem(item)
    {
        console.log(item)
        let html=this.detalle_HTML.replace("@producto",item.sku?.codigo+ " "+item.sku?.descripcion);
        html=html.replaceAll("@precio",item.precio??0);
        html=html.replaceAll("@cantidad",item.cantidad??0);
        html=html.replaceAll("@pedido",item.sys_pk??0);
        html=html.replaceAll("@pk_producto",item.sku.sys_pk??0);

        this.body_detalle.innerHTML+=html;
    },
    PrintProd(data)
    {
        if(!data)return;
    },
    InvokeService(url,data,call_back_success=null,call_back_fail=null,method="POST")
    {
        InduxsoftCrudlModel.InvokeService(url,data,call_back_success,call_back_fail,method,false);
    },
    round(num, decimales = 2) 
    {
	    var signo = (num >= 0 ? 1 : -1);
	    num = num * signo;
	    if (decimales === 0) 
	        return signo * Math.round(num);
	    num = num.toString().split('e');
	    num = Math.round(+(num[0] + 'e' + (num[1] ? (+num[1] + decimales) : decimales)));
	    num = num.toString().split('e');
	    return signo * (num[0] + 'e' + (num[1] ? (+num[1] - decimales) : -decimales));
	}
}