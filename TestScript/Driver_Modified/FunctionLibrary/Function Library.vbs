
 Function GetEnvironmentVariableValue(strEnvironmentVariable)
	Set WShell = CreateObject("WScript.Shell")
	Set WShellEnv = WShell.Environment("User")
	strPersonalNumber = WShellEnv(strEnvironmentVariable)
	Set WShellEnv = Nothing
	Set WShell = Nothing	
	GetEnvironmentVariableValue = strPersonalNumber
End Function

Function SetEnvironmentVariableValue(strEnvironmentVariable,strEnvironmentValue)
	Set WShell = CreateObject("WScript.Shell")
	Set WShellEnv = WShell.Environment("User")
	WShellEnv(strEnvironmentVariable) = strEnvironmentValue
	Set WShellEnv = Nothing
	Set WShell = Nothing	
End Function


Function CreateReport(strResultFileROOTPath,strFileType,strResultFileNAME)
			Call LoadEnvironmentVariables()
			'Call SetEnvironmentVariableValue("ExecutionStatus","")
			Environment.Value("ExecutionStatus") = ""	 	
	
	Set objFSO = CreateObject("Scripting.FileSystemObject")
	If Not objFSO.FolderExists(strResultFileROOTPath & "\" & strResultFileNAME) Then
		objFSO.CreateFolder(strResultFileROOTPath & "\" & strResultFileNAME)
	End If	
	strTimeStamp = Replace(Date,"/","") & "_" & Hour(now) & "_" & Minute(now) & "_" & Second(now)
	strReportFolderPath = strResultFileROOTPath & "\" & strResultFileNAME & "\" & strResultFileNAME & "_" & strTimeStamp
 	objFSO.CreateFolder(strReportFolderPath)
 	strFolderName = objFSO.GetFolder(strReportFolderPath).Name
 	arrstrFileType = Split(strFileType,",")
 	For Iterator = 0 To UBound(arrstrFileType) 		
	 	Select Case UCase(arrstrFileType(Iterator))
	 		Case "EXCEL"
	 			strResultFileNAME_New = strReportFolderPath & "\" & strFolderName & ".xlsx"
	 			Set objExcel = CreateObject("Excel.Application")
	 			Set objWorkBook = objExcel.Workbooks.Add()
	 			objWorkBook.SaveAs(strResultFileNAME_New)
				objWorkBook.Close
				Set objWorkBook = Nothing
				Set objExcel = Nothing
				'Call SetEnvironmentVariableValue(ExcelResultFilePath,strResultFileNAME_New)
				Environment.Value("ExcelResultFilePath") = strResultFileNAME_New
				Environment.Value("intImageCount") = 1
				Environment.Value("GapBetweenImages") = 1
				Environment.Value("ExcelReport") = True
	 		Case "HTML"
	 			Set objFile = CreateObject("scripting.filesystemobject")
				
				'ObjFileName.write Environment.value("HTMLResultData")
				
	 			'strHTMLFilePath = strReportFolderPath & "\" & strFolderName & ".html"
				'Call SetEnvironmentVariableValue("HTMLResultFilePath",strHTMLFilePath)
				Environment.Value("HTMLResultFilePath") = strReportFolderPath & "\" & strFolderName & ".html"
				Set ObjFileName = objFile.CreateTextFile(Environment.Value("HTMLResultFilePath"),True,False)
				'Environment.Value("HTMLReport") = True
				'objFileName.Close
				'Set objFile = objFile.OpenTextFile(strHTMLResultsPath, 8,TRUE)
				
				         'ObjFileName.writeline"<td width=5% align=left><font color=darkblue face=Verdana size=3><b>Status_Temp</b></font></td><tr>"        
				        objFileName.WriteLine "<HTML><font face=Verdana size=1><BODY BGColor=white Text=black><img align=left src=C:\Users\darapch\Desktop\Republic_Services_Logo.jpg alt=Republic_Services style=width:120px;height:95px;><img align=right src=C:\Users\darapch\Desktop\Republic_Services_Logo.jpg alt=Republic_Services style=width:120px;height:95px;><BR><CENTER><B><Font Color=red size=3><I>InfoPro Test Execution Report</I></Font><BR><Font size=2>Test Case Name: " & strResultFileNAME & "<BR>Execution started at " & Now & " <DIV id=status></DIV></Font></Body>"
				     	ObjFileName.writeline "<TABLE border=1>" & "<TR>" & "<TH BGCOLOR=LightSlateGray text=white>" & "Step" & "</TH>" & "<TH BGCOLOR=LightSlateGray text=white>" & "Step Details" & "</TH>" & "<TH BGCOLOR=LightSlateGray text=white>" & "Status" & "</TH>" & "</TR>"			
				'Environment.Value("HTMLResultData") = "<HTML><BR><BR><BR><BR><BODY BGColor=123456 Text=white><CENTER><B><TABLE border=1>" & "<TR>" & "<TH>" & "Step" & "</TH>" & "<TH>" & "Step Details" & "</TH>" & "<TH>" & "Status" & "</TH>" & "</TR>"
			Case Else
				'Reporter.ReportEvent micFail,"Verify File Type","The Entered " & strFileType & " is NOT Valid"
				'ExitTest
	 	End Select
 	Next
 End Function






Function AddHTMLResultTableRow(strStepName,strStepDetails,strStatus)
	'If Environment.Value("HTMLReport") Then
		
		Select Case UCase(strStatus)
			Case "PASS"
				'Reporter.ReportEvent micPass,strStepName,strStepDetails
			Case "FAIL"
				'Reporter.ReportEvent micFail,strStepName,strStepDetails
			Case "DONE"
				'Reporter.ReportEvent micDone,strStepName,strStepDetails
		End Select
	 	strHTMLResultsPath = Environment.Value("HTMLResultFilePath")
	 	Set objFso = CreateObject("Scripting.FileSystemObject")
	 	Set objFile = objFso.OpenTextFile(strHTMLResultsPath, 8,TRUE)

	 	Select Case UCase(strStatus)
	 		Case "PASS"
	 			strFontColor = "Green"	 			
	 		Case "FAIL"
	 			strFontColor = "Red"
	 			'Environment.Value("ExecutionStatus") = "Fail"
				'Call SetEnvironmentVariableValue("ExecutionStatus","Fail")
	 		Case "DONE"
	 			strFontColor = "Grey"
	 	End Select 		

	 	objFile.WriteLine "<TR>" & "<TD>" & strStepName & "</TD>"  & "<TD>" & strStepDetails & "</TD>" & "<TD>" & "<FONT COLOR=" & strFontColor & ">" & UCase(strStatus)    	 	
		'strStatus =  GetEnvironmentVariableValue("ExecutionStatus") & ";" & UCase(strStatus)
		'Call SetEnvironmentVariableValue("ExecutionStatus",strStatus)
		strStatus =  Environment.Value("ExecutionStatus") & ";" & UCase(strStatus)
		Environment.Value("ExecutionStatus") = strStatus

		
	 	
 	'End If
 End Function







Function WriteExecutionStatus()
		'If GetEnvironmentVariableValue("ExecutionStatus")="" Then
		'	Call SetEnvironmentVariableValue("ExecutionStatus","PASS")
		'End If
	 	strHTMLResultsPath = Environment.Value("HTMLResultFilePath")
	 	Set objFso = CreateObject("Scripting.FileSystemObject")
	 	Set objFile = objFso.OpenTextFile(strHTMLResultsPath, 8,TRUE)
		
		If InStr(Environment.Value("ExecutionStatus"),"FAIL")>0 Then
			strStatus = "FAIL"
		Else
			strStatus = "PASS"
		End If
	 	Select Case UCase(strStatus)
	 		Case "PASS"
	 			strFontColor = "Green"	 			
	 		Case "FAIL"
	 			strFontColor = "Red"
	 		Case "WARNING"
	 			strFontColor = "Gray"
	 		Case "DONE"
	 			strFontColor = "Blue"
	 			'Environment.Value("ExecutionStatus") = "Fail"	 		
				
	 	End Select
	 	objFile.WriteLine "</Table><CENTER><H1>Status : <Font size=3 color=" & strFontColor & ">" & UCase(strStatus) & "</Font></HTML>" 		
 End Function
 
 Function LoadEnvironmentVariables()
	Environment.Value("ExcelReport") = False
	Environment.Value("HTMLReport") = False
	Environment.Value("HTMLResultFilePath") = ""
	Environment.Value("ExcelResultFilePath") = ""
	Environment.Value("intImageCount") = 1
	Environment.Value("GapBetweenImages") = 1
	Environment.Value("ExecutionStatus") = ""
End Function

Function SaveScreenShot() 
	If Environment.Value("ExcelResultFilePath")<>"" Then
		
	
	 strResultFilePath = Environment.Value("ExcelResultFilePath")
	 intImageCount = Environment.Value("intImageCount")
	 intGapBetweenImages = Environment.Value("GapBetweenImages")
	 Set ObjFSO = CreateObject("Scripting.FileSystemObject")
	 PicLocationParentFolder = objFSO.GetFile(strResultFilePath).ParentFolder.Path
	 PicLocation = PicLocationParentFolder & "\screen" & intImageCount & ".bmp"
	
	 Desktop.CaptureBitmap PicLocation
	'TEWindow("InfoProWindow").CaptureBitmap PicLocation
	 Set objExcel = CreateObject("Excel.Application")
	 Set objWB = objExcel.Workbooks.Open(strResultFilePath)
	 Set objWS = objWB.Worksheets(1)	 
	  'intGapBetweenImages = intImageCount
	            'If Dir(PicLocation) <> "" Then
	                With objWS.Range("C" & intGapBetweenImages)
	                    Set myPict = .Parent.Pictures.Insert(PicLocation)
	                    myPict.Top = .Top
	                    myPict.Left = .Left
	                    'myPict.Placement = xlMoveAndSize
	 
	                End With
	            'End If
	 objWB.Save
	 intGapBetweenImages = intImageCount*35
	 Environment.Value("GapBetweenImages") = intGapBetweenImages
	 objWB.Close
	 intImageCount = intImageCount + 1
	 Environment.Value("intImageCount") = intImageCount
	 Set objWS = Nothing
	 Set objWB = Nothing
	 Set objExcel = Nothing
	End If 
 End Function


'Call CreateReport("C:\Users\darapch\Downloads","HTML","MyTest")
'Call AddHTMLResultTableRow("Launch the InfoPro Sys01","The InfoPro Sys01 has been launched","pass")
'Call AddHTMLResultTableRow("Enter Username","The Username 'darapch' has been entered","pass")
'Call AddHTMLResultTableRow("Enter Password","The Password 'xxxxxxx' has been entered","pass")
'Call AddHTMLResultTableRow("Click ENTER","Clicked the ENTER on the Login Page","pass")
'Call AddHTMLResultTableRow("Verify Home Page","The Home Page is displayed","pass")
'Call WriteExecutionStatus()




