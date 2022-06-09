Echo.channel('client-app-notification').listen('WebHookUpdate', (e) => {
  payload = JSON.parse(e.payload);
  if(clientContext.context.account.subdomain == payload.subdomain && payload.ticket == clientContext.context.ticketId){
    $.ajax({
      type: "GET",
      url: "https://slayhub.io/api/"+payload.service+"/"+payload.type,
      data : {
        domain  : clientContext.context.account.subdomain,
        uuid : payload.uuid
      },
      dataType: "JSON",
      success: function (response) {
        if(response.type == 'issue_comment'){
          if($("div#issue-list-"+response.issue).children('blockquote#comment-item-'+response.comment).length == 0){
            $("div#issue-list-"+response.issue).append('<figure><blockquote id="comment-item-'+response.comment+'" class="blockquote" style="font-size: 16px"> > '+response.message+'</blockquote><figcaption class="blockquote-footer" style="font-size: 12px">'+response.user+'</figcaption></figure>')
          }
        }else if(response.type == 'issue'){
          $("#status-of-"+response.issue).text(response.issue_status);
          if(response.issue_labels != null){
            $("#labels-of-"+response.issue).html('');
            response.issue_labels.forEach(label=> {
              $("#labels-of-"+response.issue).append('<span class="badge me-1" style="background-color:'+label.color+'">'+label.name+'</span>');
            });
          }
        }else if(response.type == 'push'){
          if(clientContext.context.ticketId === response.ticket_id){

            /*
              Have to check issue_link && issue_number from payload
              start with this 
            */
           
            var slicedCommitId = response.slice_id.slice(0, 7);
            $("#linkedIssues"+response.issue_linked).append('<a href="#swapButton'+response.commit_id+'" onclick="highlightMyCommit(\'swapButton'+response.commit_id+'\')" class="badge bg-secondary text-white me-1 btn">#'+slicedCommitId+'</a>');

            /*
              check how to handle the structure
              <div class="form-control" id="linkedIssues{{$issue->id}}">
                @if($issue->commits->count() > 0)
                  @foreach($issue->commits as $commit)
                    <a href="#swapButton{{$commit->id}}" onclick="highlightMyCommit('swapButton{{$commit->id}}')" class="badge bg-secondary text-white me-1 btn">{{'#'.Str::limit($commit->commit_id, 7, '') }}</a>
                  @endforeach
                @else
                  <div class="badge bg-secondary text-white">none</div>
                @endif
              </div>

              Refer to this
              Its the frontend item
            */
           
            if($("div#repo-issue-list-of-"+response.repo_id).length){
              //DOM for file modified
              $("#collapseButtonCollection").append('<button id="swapButton'+response.commit_id+'" type="button" class="btn badge text-dark" onclick="swapCollapse(\''+response.commit_id+'\')" data-bs-toggle="collapse" data-target="#collapseCommit'+response.commit_id+'" data-bs-target="#collapseCommit'+response.commit_id+'" aria-expanded="false" aria-controls="collapseCommit'+response.commit_id+'">'+slicedCommitId+'<small>&#9660;</small></button>');
              // change this to the current updated UI
              $("#collapseFilesList").append('<div class="collapse" id="collapseCommit'+response.commit_id+'"><div class="row-fluid my-2 p-2"><div id="added-'+response.commit_id+'" class="row-fluid"></div><div id="removed-'+response.commit_id+'" class="row-fluid"></div><div id="modified-'+response.commit_id+'" class="row-fluid"> </div></div><hr><small> Legends : <div class="float-end"><span class="badge bg-success text-white">added</span><span class="badge bg-danger text-white">removed</span><span class="badge bg-info text-white">modified</span></div></small></div></div>');
              if(response.files_modified.length > 0){
                response.files_modified.forEach(filesAction => {
                  $("#modified-"+response.commit_id).append('<span class="badge bg-info text-white">'+filesAction+'</span>')
                });
              }
              if(response.files_added.length > 0){
                response.files_added.forEach(filesAction => {
                  $("#added-"+response.commit_id).append('<span class="badge bg-success text-white">'+filesAction+'</span>');
                });
              }
              if(response.files_removed.length > 0){
                response.files_removed.forEach(filesAction => {
                  $("#removed-"+response.commit_id).append('<span class="badge bg-danger text-white">'+filesAction+'</span>');
                });
              }
            }
          }
        }
      }
    });
  }
});
Echo.channel('kick-me').listen('SlayHubUpdate', (e) => {
  payload = JSON.parse(e.payload);
  if(clientContext.context.account.subdomain == payload.subdomain && activeRepo == payload.repo){
    window.location.reload();
  }
});
