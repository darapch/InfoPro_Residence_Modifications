Environment.Value("RootPath") = Split(Environment.Value("TestDir"),"TestScript")(0)

str_ControlSheetPath = Environment.Value("RootPath") & "DataSheet\ControlSheet.xls"

ExecuteFile Environment.Value("RootPath") & "Config\Configuration.vbs"

Environment.Value("CurrentTestDataSheet") = ""
Environment.Value("TestSuitName") = "SampleRegression"

Call CreateTestSetReport(Environment.Value("RootPath") & "\Reports",Environment.Value("TestSuitName"))
Set objExcelDB = CreateObject("ADODB.Connection")
objExcelDB.Open "Driver={Microsoft Excel Driver (*.xls)};DBQ=" & Environment.Value("RootPath") & "DataSheet\ControlSheet.xls"
Set objRecordSet = CreateObject("ADODB.RecordSet")
objRecordSet.Open "select * from [" & Environment.Value("TestSuitName") & "$] where Execute='Y'",objExcelDB
intRecords = 0

While NOT objRecordSet.EOF	
	ReDim Preserve arrTestCases(intRecords)
	strCurrentTestCase = objRecordSet("TestCase")
	arrTestCases(intRecords) = strCurrentTestCase	
	intRecords = intRecords + 1
	objRecordSet.MoveNext
Wend


For intTestCase = 0 To UBound(arrTestCases)
	Environment.Value("CurrentTestDataSheet") = arrTestCases(intTestCase)
	LoadAndRunAction Environment.Value("RootPath") & "TestScript\Driver_Repaired","Action1",oneIteration
	Call AddTestSetRow(Environment.Value("CurrentTestDataSheet"),"Pass",Environment.Value("HTMLResultFilePath"))
Next


