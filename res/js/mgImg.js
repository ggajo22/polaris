/* 이미지 삭제*/
function deleteImg(){
	var postData = new Object();
	postData['IMG_ID'] = $('input[name=IMG_ID]').val();
	bootConfirm('이미지를 정말 삭제하시겠습니까?',function(){
		$.post('./?proc=resource&method=deleteMemberImg',postData,function(data){
			data = getJSON(data);
			procJSON(data,{
				success:function(){
					$('.stud_img').attr('src',$('#ORIGINAL_IMG').val());
					bootAlert('Complete Delete','파일이 영구히 삭제되었습니다.','success');
				}
			});
		});
	});
}
/* 이미지 업로드*/
function uploadImg(){
	var form = document.imgUploadForm;
	if(!form.IMG_FILE.value)
		bootAlert('Invalid File','파일이 선택되지 않았습니다. 이미지를 클릭해서 파일을 선택해주세요.','danger');
	else{
		bootConfirm('선택한 파일을 정말 업로드 하시겠습니까?<br/>기존의 이미지는 삭제됩니다!',function(){
			$(form).ajaxSubmit({
				success:function(data){
					data = getJSON(data);
					procJSON(data,{
						success:function(){
							var imgPath = data.PATH;
							bootAlert('Complete','업로드 완료','success',function(){
								$('.stud_img').attr('src',imgPath+'?'+new Date().getTime());
							});
						}
					});
				}
			});
		});
		
		
	}
	return false;
};
/* 이미지 체크 */
function checkImgFile(fileInput){
	var ext = fileInput.value.split('.');
	ext = ext[ext.length-1];
	switch(ext.toLowerCase()){
	case 'jpg':case 'png':case 'gif':case 'bmp':case 'jpeg':
		bootAlert('Ready to Upload','하단의 업로드 버튼을 누르시면 이미지가 교체됩니다.<br/>(기존의 이미지는 삭제됩니다.)','success');
		break;
	default:
		bootAlert('Invalid imgType','잘못된 이미지입니다.','danger',function(){
			fileInput.value = '';
		});
		break;
	}
};