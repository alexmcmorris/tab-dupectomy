
function _DuplicateCloser_closeIfDuplicate(tab)
{
	if (this.existing[tab.url.toLowerCase()])
	{
		chrome.tabs.remove(tab.id);
	}
	else
	{
		this.existing[tab.url.toLowerCase()] = tab;
	}
}

function DuplicateCloser()
{
	this.existing = [];
	this.closeIfDuplicate = _DuplicateCloser_closeIfDuplicate;
}

function closeDuplicateTabs(tabs)
{
	var dupeCloser = new DuplicateCloser();
	for (var index in tabs)
	{
		dupeCloser.closeIfDuplicate(tabs[index]);
	}	
}

function entryPoint()
{
	chrome.tabs.getAllInWindow(null, closeDuplicateTabs);
}

chrome.browserAction.onClicked.addListener(entryPoint);
