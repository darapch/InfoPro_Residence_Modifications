
On Error Resume Next

'Environment.Value("Site") = "00001"
'Environment.Value("ContainerGroup") = "2"
'Environment.Value("Action") = "1"

Environment.Value("Site") = func_SetToMaxFieldLength(Environment.Value("Site"),5)
Environment.Value("ContainerGroup") = func_SetToMaxFieldLength(Environment.Value("ContainerGroup"),5)

If VerifyScreenHeader("CONTAINER SELECTION SCREEN") Then
	Call func_EnterValueInTeField("BIDSC014_CONTAINER SELECTION SCREEN","Locate Site",Environment.Value("Site"))
	Call func_sendkey("ENTER")
	If func_SearchItemInGrid(Environment.Value("Site"),0)>0 Then		
		Call func_reportStatus("Pass","Verify Site","The Site '" & Environment.Value("Site") & "' is available")
		intContainerGroupFieldID = func_SearchItemInGrid(Environment.Value("ContainerGroup"),0)
		If intContainerGroupFieldID>0 Then
			Call func_reportStatus("Pass","Verify Container Group","The Container Group '" & Environment.Value("ContainerGroup") & "' is available")
			TeWindow("InfoProWindow").TeScreen("BIDSC014_CONTAINER SELECTION SCREEN").TeField("field id:=" & intContainerGroupFieldID).SetCursorPos
			Call func_sendkey("BACKTAB")
			Call func_sendkey(Environment.Value("Action"))
			Call func_sendkey("ENTER")			
		Else
			func_SetReturnCodeToZero()
		End If
	Else
		func_SetReturnCodeToZero()
	End If
Else
	func_SetReturnCodeToZero()
End If


	



