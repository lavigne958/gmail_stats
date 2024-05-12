# gmail_stats

Google AppScripts that counts how many e-mails you received from each recepient.

## Context

- Like many other my inbox is full, with dozeon of thousands of mails
- most of them: I don't need them
- How do I filter the ones I don't need the most ?

## Proposal

I decided to write some basic AppScript that check every e-mail and
record how many mail received from each unique recipient.

From there I can see which recipient sent me most emails and then start digging from
there filtering first on the recipient, then on finer filter if needed.

## Example

- received > 1000 mails from some online magazines
- it was 10 years ago
- the mail contains only the headlines of the new magazin
- all of them can be removed.

## How to use it ?

The code in this repository is intended to be used inside Google AppScript env.
It's not meant to run on your computer.

follow the bellow guide in order to run the code.

### Create the AppScript project

- login with your gmail account to: [https://script.google.com/home](https://script.google.com/home)
- create a new project
- you now should have a new bank editor open.
- copy/paste the code from `src/main.gs` into the current open file in the online editor
    - overwrite any present code we don't care
- save the changes
- run the function `main`
    - currently on the top of the file editor you'll find a selector with all functions described in the file.
    - select the `main` function. (poissbly the currently selected function is `ts_to_sec`)
    - press the `|> Run` button
- you'll be asked to accept some permissions
    - the script accesses you mail box in order to count your email, it needs your permission to do so.
    - the script writes a new file on your google drive, it needs your permission to do so.

- let it ~go~ run

After some time the script has parsed 2000 mail threads (default value)

You can run the script again and again until it has parsed all your mail.

It will update the spreadsheet file according to the new values it finds.

### Note:

- the script parses at most 2000 threads
- the script parses threads by batch of 500
- the script only print mail recipient with >= 100 messages found
- the script remembers everything it has seen and stores it in the script properties.
    - you can clear that by running the function `reset_all_counters`

