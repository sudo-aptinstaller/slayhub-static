Echo.channel('devops-client-app-notification').listen('WebHookAzureUpdate', (e) => {
    payload = JSON.parse(e.payload);
    if(ticketId){
        if(ticketId == payload.ticket_id){
            $('div#commentContainer').append('<div class="row-fluid mb-3" ><div class="card card-body mb-3 rounded px-2 py-2" style="background-color: #E9E9E9"><h6 class="font-weight-bold">'+payload.author+'<span class="font-weight-normal text-muted float-right" style="color : white !important"></span></h6><h6>'+payload.comment_body+'</h6><p class="text-right text-muted m-0" style="color : white !important">'+payload.created_at+'</p>');
        }
    }
});



Echo.channel('kick-me-azure').listen('AzureUpdate', (e) => {
    payload = JSON.parse(e.payload);
    if (clientContext.context.account.subdomain == payload.subdomain && activeRepo == payload.repo) {
        window.location.reload();
    }
});
