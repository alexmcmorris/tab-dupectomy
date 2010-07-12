
chrome.browserAction.onClicked.addListener(closeDuplicateTabsInCurrentWindow);
chrome.tabs.onUpdated.addListener(countDuplicateSiblings);
chrome.tabs.onRemoved.addListener(countDuplicateSiblings);

function closeDuplicateTabsInCurrentWindow()
{
   chrome.tabs.getAllInWindow(null, closeDuplicateTabs);
}

function closeDuplicateSiblings(tab)
{
   chrome.tabs.getAllInWindow(tab.windowId, closeDuplicateTabs)
}

function countDuplicateSiblings(tab)
{
   chrome.tabs.getAllInWindow(tab.windowId, countDuplicateTabs);
}

function closeDuplicateTabs(tabs)
{
   var dupeCloser = new DuplicateCloser();
   for (var index in tabs) 
   {
      dupeCloser.closeIfDuplicate(tabs[index]);
   }
   
   showDuplicateCount(0);
}

function countDuplicateTabs(tabs)
{
   var dupeCounter = new DuplicateCounter();
   for (var index in tabs) 
   {
      dupeCounter.countIfDuplicate(tabs[index]);
   }
 
    showDuplicateCount(dupeCounter.count);
}

function showDuplicateCount(value)
{
	function BadgeText(value)
	{
	   if (value == 0) 
	   {
	      this.text = "";
	   }
	   else 
	   {
	      this.text = value + '';
	   }
	}

    chrome.browserAction.setBadgeText(new BadgeText(value));
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

function DuplicateCounter()
{
   this.cache = new TabCache();
   this.count = 0;
   
   this.countIfDuplicate = function(tab)
   {
      if (this.cache.exists(tab)) 
      {
         this.count += 1;
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

