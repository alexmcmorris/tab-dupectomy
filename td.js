
chrome.browserAction.onClicked.addListener(closeDuplicateTabsInCurrentWindow);

function closeDuplicateTabsInCurrentWindow()
{
	chrome.tabs.getAllInWindow(null, closeDuplicateTabs);
}

function closeDuplicateTabs(tabs)
{
	var dupeCloser = new DuplicateCloser();
	for (var index in tabs)
	{
		dupeCloser.closeIfDuplicate(tabs[index]);
	}	
}

function DuplicateCloser()
{
	this.cache = new TabCache();
	
	this.closeIfDuplicate = function(tab)
	{
		if (this.cache.exists(tab))
		{
			chrome.tabs.remove(tab.id);
		}
		else
		{
			this.cache.remember(tab);
		}		
	}
}

function TabCache()
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
}
