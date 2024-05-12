// USER INPUTS

// the e-mail address that receives the mails you want to count
var my_email = null
// the name of the file for the resulting stats
var result_file = null

function ts_to_sec(timestamp) {
  return Math.floor(timestamp / 1000);
}

function main() {
  console.log("init values")
  if (my_email == null || result_file == null) {
    console.error("my_email and result_file can't be null, please set them first !");
    return;
  }

  let init = Date.now();
  var threads;
  var nr_threads = 0;
  let range = 500;
  let max = 2000;

  let propertiesStore = PropertiesService.getUserProperties();
  let nr_thread_prop = propertiesStore.getProperty("nr_threads");
  if (nr_thread_prop != null) {
    nr_threads = parseInt(nr_thread_prop)
  }
  let start = nr_threads

  var summary = {}
  let previous_list = propertiesStore.getProperty("summary");
  if (previous_list != null) {
    summary = JSON.parse(previous_list)
  }

  let get_mails = Date.now()
  console.log("[" + ts_to_sec(get_mails - init) + "] get emails - batch size = " + range);
  for (i = start; (nr_threads - start) < max; i += range) {
    let get_mail_range = Date.now();
    threads = GmailApp.getInboxThreads(i, range)
    nr_threads += threads.length;
    let count_mails = Date.now()
    console.log("[" + ts_to_sec(count_mails - get_mail_range) + "] count emails")

    for (j = 0; j < threads.length; j++) {
      let messages = threads[j].getMessages()
      let from = messages[0].getFrom()
      let count = messages.length

      let matches = from.match(/.* <(.+)>/)
      if (matches != null && matches.length > 0) {
        from = matches[1]
      }

      if (from.includes(my_email)) {
        continue
      }

      if (!(from in summary)) {
        summary[from] = 0
      }

      summary[from] += count;
    }
    let add_mails = Date.now();
    console.log("\t[" + ts_to_sec(add_mails - get_mail_range) + "]  parsed " + threads.length + " threads");
  }

  let get_ss = Date.now();
  console.log("[" + ts_to_sec(get_ss - get_mails) + "]init spreadsheet")
  var ss = null;
  var files = DriveApp.getFilesByName(result_file);
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next())
  } else {
    ss = SpreadsheetApp.create("mail_stats");
  }

  var sheet = ss.getActiveSheet();
  sheet.clear();
  sheet.setName("stats")
  sheet.appendRow(["from", "quantity"])

  let insert_count = Date.now();
  console.log("[" + ts_to_sec(insert_count - get_ss) + "]insert stats to spreadsheet");
  for (let from in summary) {
    if (summary[from] > 100) {
      sheet.appendRow([from, summary[from]])
    }
  }

  var filter_range = sheet.getRange("stats!A1:B");
  var filter = filter_range.getFilter()
  if (filter == null) {
    filter = filter_range.createFilter();
  }
  filter.sort(2, false);
  sheet.autoResizeColumn(1)

  let format_ss = Date.now();
  console.log("[" + ts_to_sec(format_ss - insert_count) + "]set new properties")

  propertiesStore.setProperty("nr_threads", nr_threads.toString())
  propertiesStore.setProperty("summary", JSON.stringify(summary))
  console.log("total exec time: " + ts_to_sec(format_ss - init))
}
