
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
   processTabs(tabs, new Closer());
   showDuplicateCount(0);
}

function countDuplicateTabs(tabs)
{
   var counter = new Counter();
   processTabs(tabs, counter);
   showDuplicateCount(counter.count);
}

function processTabs(tabs, implementation)
{
   var processor = new DuplicateProcessor(implementation);
   for (var index in tabs) 
   {
      processor.process(tabs[index]);
   }
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

function DuplicateProcessor(implementation)
{
   this.cache = new TabCache();
   this.implementation = implementation;
   
   this.process = function(tab)
   {
      if (this.cache.exists(tab)) 
      {
         implementation.execute(tab);
      }
      else 
      {
         this.cache.remember(tab);
      }
   }
}

function Counter()
{
   this.count = 0;
   this.execute = function(tab)
   {
      this.count += 1;
   }
}

function Closer()
{
   this.execute = function(tab)
   {
      chrome.tabs.remove(tab.id);
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

