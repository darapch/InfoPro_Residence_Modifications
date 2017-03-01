
Environment.Value("Route") = "1201"
TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("Route").SetTOProperty "text",Environment.Value("Route")

If TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("Route").Exist(5) Then
	Call func_reportStatus("Pass", "Found the Route " & Environment.Value("Route"), "Found the Route " & Environment.Value("Route"))
	intFieldID  = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("Route").GetROProperty("field id")-15	
	strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intFieldID).getroproperty("text")
	If UCase(strStatus)="ENDR" Then
		TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("Route").SetCursorPos
		TeWindow("InfoProWindow").TeScreen("BIGDS001").SendKey TE_BACKTAB
		TeWindow("InfoProWindow").TeScreen("BIGDS001").SendKey "C"
		TeWindow("InfoProWindow").TeScreen("BIGDS001").SendKey TE_ENTER
		intTotalLifts = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS002").TeField("TotalLifts").GetROProperty("text"))
		intActualLifts = Trim(TeWindow("InfoProWindow").TeScreen("BIGDS002").TeField("ActualLifts").GetROProperty("text"))
		If intTotalLifts=intActualLifts Then
			TeWindow("InfoProWindow").TeScreen("BIGDS002").SendKey TE_PF11
			TeWindow("InfoProWindow").TeScreen("BIGDS002").SendKey TE_PF11	
			strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("field id:=" & intFieldID).getroproperty("text")
			If strStatus="CLSE" Then			
				'Call func_reportStatus("FAIL", "Verify Status","Review and Close has been done succussfully. The status : CLSE")
				'If Trim(UCase(Environment.Value("NavigateBackTOSelection")))="YES" Then
					TeWindow("InfoProWindow").TeScreen("CommonScreen").SendKey TE_PF3
					TeWindow("InfoProWindow").TeScreen("CommonScreen").SendKey TE_PF3
				'End If
			End If
		Else
			TeWindow("InfoProWindow").TeScreen("CommonScreen").SendKey TE_PF3
			Reporter.ReportEvent micFail,"Mis-match in the Number of Lifts","Total Lifts do not equal Actual Lifts.  Review Lifts Summary." & VBLF &  "ACTUAL LIFTS : " & intActualLifts & ". TOTAL LIFTS : " & intTotalLifts
			'Call func_reportStatus("FAIL", "Mis-match in the Number of Lifts","Total Lifts do not equal Actual Lifts.  Review Lifts Summary." & VBLF &  "ACTUAL LIFTS : " & intActualLifts & ". TOTAL LIFTS : " & intTotalLifts)		
		End If
		
	Else
		'Call func_reportFailureScreenshot()
		'Call func_reportStatus("FAIL", "Verify Pre-Requisite Status","The status of the Route " & Environment.Value("Route") & " is not ENDR")
	End If		
Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Open Route screen does not exist", "")
End If








