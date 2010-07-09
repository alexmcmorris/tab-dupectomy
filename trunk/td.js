
function DuplicateCloser()
{
	this.tabs = [];
	
	this.exists = function(tab)
	{
		return this.tabs[tab.url.toLowerCase()];	
	}
	
	this.remember = function(tab)
	{
		this.tabs[tab.url.toLowerCase()] = tab;
	}
	
	this.closeIfDuplicate = function(tab)
	{
		if (this.exists(tab))
		{
			chrome.tabs.remove(tab.id);
		}
		else
		{
			this.remember(tab);
		}		
	}
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
