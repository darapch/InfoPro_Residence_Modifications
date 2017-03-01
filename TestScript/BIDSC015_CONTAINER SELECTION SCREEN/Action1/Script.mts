
If TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("ContainerSelectionScreen").Exist(4) Then
	Call func_reportStatus("Pass", "Verify Container Selection Screen","Container Selection Screen is displayed")
Else
	Call func_reportStatus("Fail", "Verify Container Selection Screen","Container Selection Screen is NOT displayed")
	ExitTest
End If

Environment.Value("SiteNumber") = "00001"
Environment.Value("ContainerGroup") = "5"
Environment.Value("Status") = "ACTIVE"

If Len(Environment.Value("ContainerGroup"))=1 Then
	Environment.Value("ContainerGroup") = Space(1) & Environment.Value("ContainerGroup")
ElseIf Len(Environment.Value("ContainerGroup"))>2 Then
	Call func_reportStatus("Fail", "Verify Container Group Input","The Entered Container Group has Invalid length of " & Len(Environment.Value("ContainerGroup")))	
End If

TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("ContainerGroup").SetTOProperty "text",Environment.Value("ContainerGroup")
blnFound = func_SearchItemInGrid(Environment.Value("ContainerGroup"))
If blnFound Then
	Call func_reportStatus("Pass", "Search the Container Group " & strText,"Found the Container Group " & Environment.Value("ContainerGroup"))
	intContainerGroupFieldID = TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("ContainerGroup").GetROProperty("field id")
Else
	Call func_reportStatus("Fail", "Search the Container Group " & strText,"NOT Found the Container Group " & Environment.Value("ContainerGroup"))
	ExitTest
End If


intSiteFieldID = intContainerGroupFieldID - 9
intStatusFieldID = intContainerGroupFieldID + 6
strSite = TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("field id:=" & intSiteFieldID).GetROProperty("text")
strStatus = TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("field id:=" & intStatusFieldID).GetROProperty("text")
strContainerGroup = TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("ContainerGroup").GetROProperty("text")



If UCase(strSite)=UCase(Environment.Value("SiteNumber")) Then
	Call func_reportStatus("Pass", "Verify Site","The Site " & Environment.Value("SiteNumber") & " is Found")
	If UCase(strContainerGroup)=UCase(Environment.Value("ContainerGroup")) Then
		Call func_reportStatus("Pass", "Verify Container Group","The Container Group " & Environment.Value("ContainerGroup") & " is Found")
		If UCase(strStatus)=Environment.Value("Status") Then
			Call func_reportStatus("Pass", "Verify Container Status","The Container with the Status '" & Environment.Value("Status") & "' is Found")	
			TeWindow("InfoProWindow").TeScreen("BIDSC015_ContainerSelectionScreen").TeField("ContainerGroup").SetCursorPos
			Call func_SendKey("BACKTAB")
			Call func_SendKey("SELECT")			
		Else
			Call func_reportStatus("Fail", "Verify Container Status","The Container with the Status '" & Environment.Value("Status") & "' is NOT Found. The Status Found : " & strStatus)	
		End If
	Else
		Call func_reportStatus("Fail", "Verify Container Group","The Container Group " & Environment.Value("ContainerGroup") & " is NOT Found")
		ExitTest
	End If
Else
	Call func_reportStatus("Fail", "Verify Site","The Site " & Environment.Value("SiteNumber") & " is NOT Found")
	ExitTest
End If






	
	
	
	
	
	
