var address = 
{
    address_list: [],
    url: '',

    open_address_modal(address_id=-99)
    {
        let address = (this.address_list.find(addr => addr.sys_pk == address_id) ?? { sys_pk:0, sys_recver:0 });
        utils.setValues('mdl_address', address);
        utils.openModal('mdl_address');
    }
}