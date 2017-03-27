If VerifyScreenHeader("SITE INFORMATION") Then
	intSpaces = 5-Environment.Value("Site")
	Environment.Value("Site") = Space(intSpaces) & Environment.Value("Site")
	If GetAndVerifyTeFieldValue("BIDSC002_SITE INFORMATION","Site Number",Environment.Value("Site")) Then
		Call func_reportStatus("Pass","Verify Site '" & Environment.Value("Site") & "'","Site '" & Environment.Value("Site") & "' is displayed")
		Select Case UCase(Environment.Value("Purpose"))
			Case "MOVE FORWARD"
				Call func_SendKey("ENTER")
		End Select
	Else
		Call func_reportStatus("Fail","Verify Site '" & Environment.Value("Site") & "'","Site '" & Environment.Value("Site") & "' is NOT displayed")
		Environment.Value("returncode") = 0
	End If
Else
	Environment.Value("returncode") = 0
End If
