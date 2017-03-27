On Error Resume Next

Environment.Value("ContainerGroup") = func_SetToMaxFieldLength(Environment.Value("ContainerGroup"),2)

If VerifyScreenHeader("RESIDENTIAL SERVICE INFORMATION") Then
	If GetAndVerifyTeFieldValue("RESIDENTIAL SERVICE INFORMATION","ContainerGroup",Environment.Value("ContainerGroup")) Then
		Call func_reportStatus("Pass","Verify the Container Group","The Container Group '" & Environment.Value("ContainerGroup") & "' is available" )
	Else
		Call func_reportStatus("Fail","Verify the Container Group","The Container Group '" & Environment.Value("ContainerGroup") & "' is NOT available" )
		Call func_SetReturnCodeToZero()
	End If
Else
	Call func_SetReturnCodeToZero()
End If

Call func_SetReturnCodeToZerOnError()



