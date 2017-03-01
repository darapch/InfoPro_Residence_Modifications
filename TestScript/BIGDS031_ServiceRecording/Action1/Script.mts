If TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("ServicingRecording").Exist(5)Then
	Call func_reportStatus("Pass","Verify the 'Service Recording' Screen","The 'Service Recording' screen is Available")
Else
	Call func_reportStatus("Fail","Verify the 'Service Recording' Screen","The 'Service Recording' screen is NOT Available")
	ExitTest
End If


intServFieldID = func_SearchItemInGrid(Environment.Value("ServiceNumber"))
If intServFieldID>0 Then
	intServSelFieldID = intServFieldID-2
	intCLOFieldID = intServFieldID+7	
	Call func_reportStatus("Pass","Verify the Serv # '" & Environment.Value("ServiceNumber") & "'","The Serv # '" & Environment.Value("ServiceNumber") & "' is Available")	
Else
	Call func_reportStatus("Fail","Verify the Serv # '" & Environment.Value("ServiceNumber") & "'","The Serv # '" & Environment.Value("ServiceNumber") & "' is NOT Available")
	ExitTest
End If

If Environment.Value("Purpose") = "UpdateF2NoteSFDC" Then
	Call func_UpdateF2NoteSFDC(intServFieldID,intServSelFieldID,intCLOFieldID)
End If

If LCase(Environment.Value("Purpose")) = "close" Then
	Call func_CloseNote(intServFieldID,intServSelFieldID,intCLOFieldID)
End If


Function func_CloseNote(intServFieldID,intServSelFieldID,intCLOFieldID)
	strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("field id:=" & intCLOFieldID).GetROProperty("text")
	If strStatus="Y" Then
		Call func_reportStatus("Fail","Verify the Status","The Status of the Serv# '" & Environment.Value("ServiceNumber") & "' is already 'Y'")
		ExitTest	
	Else
		Call func_reportStatus("Pass","Verify the Status","The Status for the Serv# '" & Environment.Value("ServiceNumber") & "' is '" & strStatus & "'")	
	End If
	TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("field id:=" & intServSelFieldID).Set "1"
	Call func_SendKey("ENTER")
	Call func_SendKey("F10")
	TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("CLO").SetTOProperty "attached text",Environment.Value("ServiceNumber")
	wait(3)
	Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","CLO","Y")
	Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ActionTaken","Closing the Serv# " & Environment.Value("ServiceNumber") & " - " & Date)	
	Call func_SendKey("ENTER")
	wait(1)
	strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("field id:=" & intCLOFieldID).GetROProperty("text")
	If strStatus="Y" Then
		Call func_reportStatus("Pass","Verify the Status","The Status of the Serv# '" & Environment.Value("ServiceNumber") & "' is Changed to 'Y'")			
	Else
		Call func_reportStatus("Fail","Verify the Status","The Status of the Serv# '" & Environment.Value("ServiceNumber") & "' is NOT Changed to 'Y'")
	End If	
	
	
	'Environment.Value("DivisionNumber") = "902"
	intsupposedSpaces = 5-Len(Environment.Value("DivisionNumber"))
	Environment.Value("DivisionNumber") = Space(intsupposedSpaces) & Environment.Value("DivisionNumber")
	'Environment.Value("AccountNumber") = "9523877"
	Environment.Value("Site") = "00001"
	'Environment.Value("ServiceNumber") = "34703"
	
	If Len(Month(Now))=1 Then
		Environment.Value("ScheduledCompletionMonth") = "0" & Month(Now)
	Else
		Environment.Value("ScheduledCompletionMonth") = Month(Now)
	End If
	
	If Len(Day(Now))=1 Then
		Environment.Value("ScheduledCompletionDate") = "0" & Day(Now)
	Else
		Environment.Value("ScheduledCompletionDate") = Day(Now)
	End If
	
	Environment.Value("TimeStamp") = Year(Now) & Environment.Value("ScheduledCompletionMonth") & Environment.Value("ScheduledCompletionDate")
	
	strExpectedCompKey = Trim(Environment.Value("DivisionNumber")) & Environment.Value("AccountNumber") & Environment.Value("Site") & Environment.Value("ServiceNumber") & Environment.Value("TimeStamp")
	
	Set obj_conn = CreateObject("ADODB.Connection")
	
	str_connectionString = "Driver={iSeries Access ODBC Driver};System=sys01;Uid=darapch;Pwd=Sachin8187"
		
	obj_conn.open str_connectionString
	
	str_sqlBIPSUOQuery = "SELECT * FROM NAEAIPDN.P_BIPSUO WHERE COMPOSITE_KEY='" & strExpectedCompKey & "' and  TRIGGER_TABLE='BIPSUO'"
	
	Set obj_resultSet = obj_conn.Execute(str_sqlBIPSUOQuery)
	intRecords = 0
	intBIPSUOCount = 0
	intBIPSXCount = 0
	While NOT obj_resultSet.EOF
		intBIPSUOCount = intBIPSUOCount + 1	
		obj_resultSet.MoveNext
	Wend
	Set obj_resultSet = Nothing
	
	str_sqlBIPSXQuery = "SELECT * FROM NAEAIPDN.P_BIPSUO WHERE COMPOSITE_KEY='" & strExpectedCompKey & "' and  TRIGGER_TABLE='BIPSX'"
	Set obj_resultSet = obj_conn.Execute(str_sqlBIPSXQuery)
	
	While NOT obj_resultSet.EOF
		intBIPSXCount = intBIPSXCount + 1
		obj_resultSet.MoveNext
	Wend
	Set obj_resultSet = Nothing
	
	If intBIPSUOCount>0 Then
		Call func_reportStatus("Pass","Verify Record Existancy for the Trigger Table BIPSUO","Atleast 1 Record is available for BIPSUO")
	Else
		Call func_reportStatus("Fail","Verify Record Existancy for the Trigger Table BIPSUO","No Record is available for BIPSUO")
	End If
	
	
	If intBIPSXCount>0 Then
		Call func_reportStatus("Pass","Verify Record Existancy for the Trigger Table BIPSX","Atleast 1 Record is available for BIPSX")
	Else
		Call func_reportStatus("Fail","Verify Record Existancy for the Trigger Table BIPSX","No Record is available for BIPSX")
	End If
End Function



Function func_UpdateF2NoteSFDC(intServFieldID,intServSelFieldID,intCLOFieldID)
	strStatus = TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("field id:=" & intCLOFieldID).GetROProperty("text")
	If strStatus="Y" Then
		Call func_reportStatus("Fail","Verify the Status","The Status for the Serv# '" & Environment.Value("ServiceNumber") & "' is 'Y'")
		ExitTest	
	Else
		Call func_reportStatus("Pass","Verify the Status","The Status for the Serv# '" & Environment.Value("ServiceNumber") & "' is '" & strStatus & "'")	
	End If
	TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("field id:=" & intServSelFieldID).Set "1"
	Call func_SendKey("ENTER")
	strCode = TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("Code").GetROProperty("text")
	Call func_reportStatus("Done","The Available Code","The Available Code : " & strCode)
	TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("Code").SetCursorPos
	Call func_SendKey("F4")
	wait(2)
	intCodeFieldIDInHelp = func_SearchItemInGrid(strCode)
	If intCodeFieldIDInHelp>0 Then
		intCodeDescFieldIDInHelp = intCodeFieldIDInHelp + 15
		strCodeDescription = TeWindow("InfoProWindow").TeScreen("column count:=80").TeField("field id:=" & intCodeDescFieldIDInHelp).GetROProperty("text")
		Call SetEnvironmentVariableValue("Subject",strCodeDescription)
		Call SetEnvironmentVariableValue("ServiceText",strCodeDescription & "-" & Date)
		Call func_SendKey("F3")	
		Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","Subject",strCodeDescription)
		Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ServiceText",strCodeDescription & "-" & Date)
		
		Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","Route",Environment.Value("Route"))
		
		Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","Truck",Environment.Value("Truck"))
		Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","Employee",Environment.Value("Employee"))
		If Len(Month(Now))=1 Then
			Environment.Value("ScheduledCompletionMonth") = " " & Month(Now)
		Else
			Environment.Value("ScheduledCompletionMonth") = Month(Now)
		End If
		
		If Len(Day(Now))=1 Then
			Environment.Value("ScheduledCompletionDate") = " " & Day(Now)
		Else
			Environment.Value("ScheduledCompletionDate") = Day(Now)
		End If
		Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ScheduledCompletionMonth",Environment.Value("ScheduledCompletionMonth"))
		Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ScheduledCompletionDate",Environment.Value("ScheduledCompletionDate"))
		Call func_EnterValueInTeField("BIGDS031_SERVICE RECORDING","ScheduledCompletionYear",Right(Year(Now),2))	
	End If
	
	Call func_SendKey("ENTER")
	
	If TeWindow("InfoProWindow").TeScreen("BIGDS031_SERVICE RECORDING").TeField("GridHeader").Exist(5) Then
		Call func_reportStatus("Pass","Press Enter","Information is updated and user is exit back to 'Service Recording' screen")
	Else
		Call func_reportStatus("Fail","Press Enter","Information is NOT updated and user is NOT exit back to 'Service Recording' screen")
	End If

End Function



'TRFSCMPKEY

















