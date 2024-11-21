document.addEventListener("DOMContentLoaded",()=>{cars.init();});


var cars=
{
    url_filter:"",
    _get:{},
    init()
    {
        //filtros de barra
        this.select_marca=document.getElementById("select-marca");
        this.select_modelo=document.getElementById("select-modelo");
        this.select_version=document.getElementById("select-version");

        if(this.select_marca)this.select_marca.addEventListener("change",()=>
        {
            cars.filter("modelo","marca",cars.select_marca.value);
        });
        if(this.select_modelo)this.select_modelo.addEventListener("change",
        ()=>
        {
            cars.filter("version","modelo",cars.select_modelo.value);
        });

        if(this.select_marca)
        {
            if((cars._get["a-mr"]??"")!="")this.select_marca.value=(cars._get["a-mr"]??"");

            utils.trigger(this.select_marca,"change");
        }
    },
    filter(table,field,value)
    {
        var data=
        {
            table:table
        }
        data[field]=value;
        //reutilizar codigo de cart
        cart.InvokeService(this.url_filter,data,
        (success)=>
        {
            var select=null;
            let text="";
            let selected=""
            switch (table) 
            {
                case "modelo":
                    select=cars.select_modelo;
                    text="Todos los modelos";
                    selected=cars._get["a-md"]??"";
                    break;
                    case "version":
                        select=cars.select_version;
                        text="Todas las versiones";
                        selected=cars._get["a-vr"]??"";
                        break;
            }
            cars.PrintOptionsSelect(select,success,selected,text,"*");
        });
    },
    PrintOptionsSelect(select,data,selected="",first_text="",first_value="")
    {
        if(!select || !data)return;
        
        let html=first_value.trim()!="" ? `<option value="${first_value}">${first_text}</option>`:``;

        for (let i = 0; i < data.length; i++) 
        {
            const dt = data[i];
            html+=`<option ${selected==dt.sys_pk? "selected":""} value="${dt.sys_pk}">${dt.descripcion}</option>`;
        }
        select.innerHTML=html;
        utils.trigger(select,"change");
    }
}