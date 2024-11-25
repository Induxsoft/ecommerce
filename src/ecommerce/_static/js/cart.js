document.addEventListener("DOMContentLoaded",()=>{cart.init();})

var cart=
{
    articulos:0,
    detalle:null,
    data_cart:null,
    decimales_importe:6,
    cant_prod_item:null,
    from_addres:false,
    url_add_adress:"",
    cantidad_HTML:`<div class="btn-group btn-group-sm" role="group">
                        <button type="button" class="btn border text-secondary fw-bold" onclick="cart.ActQuit(@pedido,@pk_producto)">-</button>
                            <div class="px-2 border-top border-bottom d-flex align-items-center">
                                <small id="cant_@pedido">@cantidad</small>
                            </div>
                        <button type="button" class="btn border text-secondary fw-bold" onclick="cart.ActAdd(@pedido,@pk_producto)">+</button>
                    </div>`,
    action_HTML:`<button type="button" class="btn border text-secondary fw-bold m-0" title="Eliminar" onclick="cart.ActDel(@pedido,@pk_producto)" style="padding: 2px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash hover-red" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </button>`,
    init()
    {
        this.body_detalle=document.getElementById("body_detalle");
        this.counter_cart=document.getElementById("counter_cart");
        this.subtotal=document.getElementById("subtotal");
        this.impuestos=document.getElementById("impuestos");
        this.descuento=document.getElementById("descuento");
        this.total=document.getElementById("total");
        this.add_addres=document.getElementById("add-addres");
        this.form_addres=document.getElementById("form-addres");
        this.mod_entrega=document.getElementById("f-entrega");
        this.direccion_existente=document.getElementById("direccion_existente");
        this.mod_addres_user=document.getElementById("mod_addres_user")
        this.mod_next=document.getElementById("mod_next");
        this.mod_domicilio=document.getElementById("mod-domicilio");
        this.mod_cliente_credit=document.getElementById("mod_cliente_credit");
        this.select_cliente=document.getElementById("select_cliente");
        
        if(this.articulos > 0)this.SetValue(this.counter_cart,this.articulos);

        this.detalle_HTML=`<tbody>
                            <tr>
                                <td>@producto</td>
                                <td>
                                    ${this.cantidad_HTML}
                                </td>
                                <td>@precio</td>
                                <td>@importe</td>
                                <td>
                                    ${this.action_HTML}
                                </td>
                            </tr>
                            </tbody`;

        if(this.detalle)this.PrintDetalleCart(this.detalle);
        if(this.data_cart?.totales)cart.PrinTotales(this.data_cart.totales);

        if(this.from_addres && this.add_addres)
        {
            this.add_addres.type="button";
            this.add_addres.setAttribute("onclick","cart.addAdres()");
        }
    },
    SelectFormaPago(value,e,fpago_cliente)
    {
        if(!this.mod_cliente_credit)return;

        if(Number(value)==Number(fpago_cliente))
        {
            this.mod_cliente_credit.classList.remove("d-none");
            if(this.select_cliente)this.select_cliente.setAttribute("required",true);
        }
        else
        {
            this.mod_cliente_credit.classList.add("d-none");
            if(this.select_cliente)this.select_cliente.removeAttribute("required");
        }
    },
    SelectMetEntregaDom()
    {
        if(!this.mod_entrega)return;

        var elements=this.mod_entrega.querySelectorAll("input[type='radio']");
        if(!elements)return;

        for (let i = 0; i < elements.length; i++) 
        {
            const element = elements[i];
            if(element && Number(element.value)==0)
            {
                element.checked=true;
                break;
            }
        }
    },
    radioChange(e)
    {
        if(!this.mod_domicilio)return;
        
        var element=e.target;
        this.mod_domicilio.classList.add("d-none");
        if(element && Number(element.value)==0)
        {
            this.mod_domicilio.classList.remove("d-none");
        }
    },
    RemoveSelectCard()
    {
        if(!this.mod_addres_user)return;

        var elements=this.mod_addres_user.querySelectorAll(".focusCard");
        for (let i = 0; i < elements.length; i++) 
        {
            const element = elements[i];
            if(element)element.classList.remove("focusCard");
        }
    },
    CardAddresSelected(sys_pk)
    {
        let element=document.getElementById("mod_address_"+sys_pk);
        if(!element)return;
        
        cart.RemoveSelectCard();
        
        element.classList.add("focusCard");
        if(cart.direccion_existente)cart.direccion_existente.value=sys_pk;
    },
    addAdres()
    {
        if(!this.form_addres)return;
        if(!this.form_addres.reportValidity())return;
        if(!this.form_addres.checkValidity())return;
        
        cart.SelectMetEntregaDom();
        var data=new FormData(this.form_addres);
        InduxsoftCrudlModel.Submit(this.form_addres,{},
        (success)=>
        {
            if(cart.direccion_existente)cart.direccion_existente.value=success.sys_pk;
            if(this.mod_next)this.mod_next.click();

        },null,{url:cart.url_add_adress});
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
    ActFav(sys_pk,act="add",quit=false)
    {
        var data=
        {
            producto:sys_pk,
            action:act
        }
        var prod_fav_=document.getElementById("prod_fav_"+sys_pk);
        var col_fav_=document.getElementById("col_fav_"+sys_pk);

        this.InvokeService(cart.url_ecom_fav,data,
        (success)=>
        {
            if(prod_fav_)
            {
                if(act=="add")
                {
                    prod_fav_.setAttribute("onclick",`cart.ActFav(${sys_pk},"delete")`);
                    prod_fav_.style.cssText="color:red !important;";
                }
                else if(act="delete")
                {
                    prod_fav_.setAttribute("onclick",`cart.ActFav(${sys_pk})`);
                    prod_fav_.style.cssText="color:black !important;";
                }
                else
                {
                    prod_fav_.removeAttribute("onclick");
                    prod_fav_.style.cssText="color:black !important;";
                }
            }
            if(quit && col_fav_)col_fav_.classList.add("d-none");
        },
        (fail)=>{alert(fail.message??JSON.stringify(fail));});
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
                cart.SetValue(cart.counter_cart,(success.totales.piezas??0));
                cart.PrinTotales(success.totales);
            }
            if(success.detalle)cart.PrintDetalleCart(success.detalle);
        },
        (fail)=>{alert(fail.message??JSON.stringify(fail));});
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
        if(!data)return;

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
        let html=this.detalle_HTML.replace("@producto",item.sku?.codigo+ " "+item.sku?.descripcion);
        html=html.replaceAll("@precio",item.precio??0);
        html=html.replaceAll("@cantidad",item.cantidad??0);
        html=html.replaceAll("@pedido",item.sys_pk??0);
        html=html.replaceAll("@pk_producto",item.sku.sys_pk??0);

        let importe=((item.cantidad??0) * (item.precio??0)) + (item?.impuesto1 + item?.impuesto2 + item?.impuesto3 + item?.impuesto4);
        importe=importe - (item?.descuento1 + item?.descuento1);

        html=html.replaceAll("@importe",this.round(importe,this.decimales_importe));
        if(this.body_detalle)this.body_detalle.innerHTML+=html;

        var cant_prod_=document.getElementById("cant_prod_"+item.sku?.sys_pk);
        if(cant_prod_)
        {
            cant_prod_.textContent=item.cantidad??0;
        }
    },
    PrintProd(data)
    {
        if(!data)return;
    },
    InvokeService(url,data,call_back_success=null,call_back_fail=null,method="POST")
    {
        if(!call_back_fail)call_back_fail=(fail)=>{alert(fail.message??JSON.stringify(fail));}

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