'Purpose : To submit the "EOD - Dispatch" and to make the status to OUTQ
'Author : Chinnikrishna Darapureddy

If TeWindow("InfoProWindow").TeScreen("STDJC20").TeField("Job Submission Window").Exist(5) Then
	Call func_reportStatus("Pass","Verify Job Submission Window","The Job Submission Window is Opened")
	If TeWindow("InfoProWindow").TeScreen("STDJC20").TeField("DISPATCH END OF DAY").Exist(1) Then
		Call func_reportStatus("Pass","Verify the information 'DISPATCH END OF DAY'","'DISPATCH END OF DAY' is displayed")
		Call func_SendKey("ENTER")
		wait(2)
		
		If TeWindow("InfoProWindow").TeScreen("STDJC20").TeField("Job Submission Window").Exist(1) Then
			wait(3)
		End If
		
		If NOT TeWindow("InfoProWindow").TeScreen("STDJC20").TeField("Job Submission Window").Exist(1) Then
			Call func_reportStatus("Pass","Submit the Job","The Job has been submitted")
			Call func_SendKey("F4")						
			strCommand = "WRKUSRJOB STATUS(*JOBQ) JOBTYPE(*BATCH)"
			strJobChangeCmd = "JOBQ(INFONOMAX)"
			Call func_EnterValueInTeField("Work With User Jobs","Command Prompt",strCommand)
			Call func_SendKey("ENTER")			
			intStartFieldID = 642			
			While NOT TeWindow("InfoProWindow").TeScreen("Work With User Jobs").TeField("No Jobs To Display").Exist(1)
				TeWindow("InfoProWindow").TeScreen("Work With User Jobs").TeField("field id:=" & intStartFieldID).Set "2"
				Call func_EnterValueInTeField("Work With User Jobs","Command Prompt",strJobChangeCmd)
				Call func_SendKey("ENTER")
				Call func_SendKey("F5")
			Wend
			
			If TeWindow("InfoProWindow").TeScreen("Work With User Jobs").TeField("No Jobs To Display").Exist(1) Then
				
			End If
			Call func_SendKey("F3")
			Call func_SendKey("F3")
		Else
			Call func_reportStatus("Fail","Submit the Job","The Job is NOT been submitted")
		End If					
	Else
		Call func_reportStatus("Fail","Verify the information 'DISPATCH END OF DAY'","'DISPATCH END OF DAY' is NOT displayed")
	End If
Else
	Call func_reportStatus("Fail","Verify Job Submission Window","The Job Submission Window is NOT Opened")
End If











