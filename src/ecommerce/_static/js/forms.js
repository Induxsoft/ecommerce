var forms = 
{
    init()
    {
        const chk_view_pwd = document.querySelector('#chk_view_pwd');
        const ipt_pwd_form = document.querySelector('.ipt_pwd');
        const ipt_pwd_cnfm = document.querySelector('.ipt_pwd_confirm');
        const frm_vald_pwd = document.querySelector('.frm_valide_pwd');

        if (chk_view_pwd) {
            chk_view_pwd.addEventListener('change', () => this.view_ipts_pwd(chk_view_pwd.checked));
        }
        if (ipt_pwd_form && ipt_pwd_cnfm) {
            ipt_pwd_form.addEventListener('keyup', () => this.valide_pwd_confirm(ipt_pwd_form, ipt_pwd_cnfm));
            ipt_pwd_cnfm.addEventListener('keyup', () => this.valide_pwd_confirm(ipt_pwd_form, ipt_pwd_cnfm));
        }
        if (frm_vald_pwd && ipt_pwd_form && ipt_pwd_cnfm) {
            frm_vald_pwd.addEventListener('submit', e => this.valide_pwd_form(e, ipt_pwd_form, ipt_pwd_cnfm));
        }
    },
    view_ipts_pwd(view=false)
    {
        const ipts = document.querySelectorAll('.ipt_view_pwd');
        ipts.forEach(ipt => ipt.type = (view ? 'text' : 'password'));
    },
    valide_pwd_confirm(ipt_form, ipt_conf, valide_empty_conf=false)
    {
        let ok = true;

        if (ipt_form.value != ipt_conf.value) {
            ok = false;
            if (!valide_empty_conf && ipt_conf.value == '') 
                ok = true;
        }
        else {
            ok = true;
        }

        ipt_conf.classList.toggle('border', !ok);
        ipt_conf.classList.toggle('border-danger', !ok);
        
        return ok;
    },
    valide_pwd_form(event, ipt_form, ipt_conf)
    {
        if (!this.valide_pwd_confirm(ipt_form, ipt_conf, true)) {
            event.preventDefault();
            alert('Confirmación de contraseña inválida, asegurese de escribir correctamente la contraseña para continuar');
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    forms.init();
});