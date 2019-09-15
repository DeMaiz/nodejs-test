(function(){
    
    const _ = (id)=>{
        return $(id);
    };

    let csvData = [];
    let isValid = false;
    _("#invoice_csv").on('change',async function(event){
       const $this = this;
       const length = this.files.length;
       const allowedTypes = ['application/vnd.ms-excel', 'text/csv'];
       const errors = [];
       let files = null;
       let type = '';
       console.log('Files length =>', length);
       if(length){
        files = this.files[0];
        type = files.type;
        console.log("File type =>", type);
            if(
                allowedTypes.find(function(e){
                    return e === type;
                })
            ){
                console.log('File valid');
                // Read file here then validate the data on client side befor push to server
                try {
                    const data = await readFile(files);
                    console.log("data =>",data);
                    //Client side validation using joi to validate the csv data
                    const validateData = Joi.validate(data, Joi.array().items({
                        id: Joi.number().integer().required().label('Invoice Id'),
                        amount: Joi.number().required().label('Invoice Amount'),
                        date: Joi.string().isoDate().required().label('Due Date')
                    }));
                    if(validateData.error){
                        errors.push({type: 'CSV_PARSING', message: validateData.error.details[0].message, details: validateData.error.details[0]});
                    }else{
                        csvData= data;
                        isValid= true;
                        _("button[type=submit]").attr('disabled',false);
                    }
                } catch (error) {
                    errors.push(error);
                }
            }else{
                errors.push('Invalid file type selected, Please upload the file of typ CSV');
            }
       }else{
           errors.push('No Csv file found, Please select the csv file.')
       }
       if(errors.length){
            showDialog("#basicModal",errors);
            _("button[type=submit]").attr('disabled',true);
            return
       }
    });


    function showDialog(id,errors=[]){
        console.log(errors);
        let html='<ul>';
        for (const error of errors) {
            if(typeof error ==='string'){
                html += `<li>${error}</li>`
            }else if(typeof error ==='object'){
                html+=`<ul> 
                    <li>${error.type}</li>
                    <li> Message: ${error.message}</li>
                    <li> Line : ${error.details.path[0]+1} at Column: ${error.details.context.label}</li>
                    <li> Value: ${error.details.context.value}</li>
                `;
            }
        }
        html+='</ul>';
        _(`${id} .modal-body`).html(html);
        _(id).modal('show');
        setTimeout(function(){
            // for autoclose
            _(id).modal('hide');
        },3000);
    }
    
    // copied from https://gist.github.com/ChrisManess/5493235
    async function readFile (file) {
        return new Promise((resolve,reject)=>{
            // Check for the various File API support.
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    if (e.target.result) {
                        // parse csv file in to json 
                        csv({
                            headers: ['id', 'amount', 'date'],
                            noheader: false // no header set to false for assuming the data starts from line 2
                        }).fromString(e.target.result).then(function (data) {
                            resolve(data);
                        });
                    } else {
                        reject('File reader faild to read the selected file.');
                    }
                }
                reader.readAsText(file);
            } else {
                reject('The File APIs are not fully supported in this browser.')
            }
        });
    }

    $('#upload_csv_invoices').submit(function () {
        $(this).ajaxSubmit({
            beforeSubmit: function(){
                if(!isValid){
                    return false;
                }
            },
            uploadProgress: function (e, pos, total, perc) {
                $('.progress-bar.bg-success').css('width', (perc + '%'));
            },
            error: function (xhr) {
                if (xhr.responseJSON) {
                    console.log(xhr.responseJSON);
                }
                $('.progress-bar.bg-success').css('width', '0%');
            },
            success: function () {
                console.log("invoices uploaded successfully");
                // modal('Invoices Uploaded', 'All invoices uploaded successfully', 'modal-success');
                // $('#upload-progress').addClass('hidden');
                // $('#upload-progress .progress-bar').css('width', '0%');
                // invoices_table.ajax.reload();
            }
        });
        return false;
    });
})();

$(document).ready(function() {
    $('#invoice_datatable').DataTable({
        paging: true,
        lengthChange: false,
        ordering: true,
        info: true,
        autoWidth: true,
        ajax: './list',
        dataSrc: 'data',
        columns: [
            { data: 'id' },
            { data: 'amount' },
            { data: 'date' },
            { data: 'selling_price'}
        ]
    });
});