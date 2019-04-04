chrome.browserAction.onClicked.addListener(closeDuplicateTabsInCurrentWindow);
chrome.tabs.onUpdated.addListener(countDuplicateSiblings);
chrome.tabs.onRemoved.addListener(countDuplicateSiblingsOnRemoved);

function closeDuplicateTabsInCurrentWindow()
{
   chrome.tabs.getAllInWindow(closeDuplicateTabs);
}

function countDuplicateSiblings(tabId, changeInfo)
{
   if (changeInfo.status === 'complete')
   {
      chrome.tabs.query({
         "currentWindow": true
      }, countDuplicateTabs);
   }
}

function countDuplicateSiblingsOnRemoved()
{
   chrome.tabs.query({
      "currentWindow": true
   }, countDuplicateTabs)
}

function closeDuplicateTabs(tabs)
{
   processDuplicates(tabs, new Closer());
   updateDisplay(new Display());
}

function countDuplicateTabs(tabs)
{
   const counter = new Counter();
   processDuplicates(tabs, counter);
   updateDisplay(new Display(counter));
}

function processDuplicates(tabs, implementation)
{
   const processor = new DuplicateProcessor(implementation);
   for (let index in tabs)
   {
      processor.process(tabs[index]);
   }
}

function updateDisplay(display)
{
   chrome.browserAction.setBadgeText({text: display.text});
   chrome.browserAction.setTitle({title: display.title});
}

function DuplicateProcessor(implementation)
{
   this.cache = new TabCache();
   this.process = function(tab)
   {
      const found = this.cache.exists(tab);
      if (found)
      {
         implementation.execute(this.nonSelected(found, tab));
      }
      else 
      {
         this.cache.remember(tab);
      }
   };
   
   this.nonSelected = function(found, tab)
   {
      if (!found.selected)
      {
         this.cache.remember(tab);
         return found;
      }
    
      if (!tab.selected)
      {
         return tab;
      }
    
    return null;
   };
}

function Counter()
{
   this.count = 0;
   this.urls = "";
   this.execute = function(tab)
   {
      this.count += 1;
      this.urls += tab.url + '\n';
   };
}

function Closer()
{
   this.execute = function(tab)
   {
      chrome.tabs.remove(tab.id);
   };
}

function TabCache()
{
   this.tabs = [];
   
   this.exists = function(tab)
   {
      return this.tabs[tab.url.toLowerCase()];
   };
   
   this.remember = function(tab)
   {
      this.tabs[tab.url.toLowerCase()] = tab;
   };
}

function Display(counter)
{
   if (!counter)
   {
      this.title = "";
      this.text = "";
      return
   }

   this.title = counter.urls;
   this.text = "";

   if (counter.count !== 0)
   {
      this.text = counter.count + '';
   }
}
