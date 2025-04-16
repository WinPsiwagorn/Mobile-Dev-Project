# Mobile-Dev-Project
addition by supawan:
    profile page(just view)
    analytics page
    edit ฿ in the pocket
    pay bill from expense pocket
    revamped bottom tab nav (add new lib)
    fix deadzone
    remove unused button

from BudgetApp(W.3) --> BudgetApp(W.4) edited by supawan

AddAccountScreen: 
- change account type to be 2 types
- change initial balance to be goal balance
- add condition if choose savings type will show Goal Balance to add, but if choose general type won't show the Goal to add.
- add name's suggestion for create pockets.

from BudgetApp(W.4) --> BudgetApp(W.5) edited by supawan

AccountScreen:
- change 2blocks above to show total balance of General&Savings Account
- change filter 2 types (General, Savings)
- redesign main detail is account that created

TransactionDetailScreen:
- remove payment method, location

ProfileScreen:
- remove Stats Cards
- remove payment method menu

EditProfileScreen:
- remove phone, location

from BudgetApp(W.5) --> BudgetApp(V.6)
edit by kongphop

Navigation Bar:
- change Bill to Add
- connect the add function to the add transaction page.
Add Transaction:
- change Bill to Add
- added income and expenses function

from BudgetApp(v.1.0.0) --> BudgetApp(v.1.0.2) edited by supawan

PremiumAccountDetailsScreen:
- redesign style.planoption to be fit for every device
- assigned when click "Subscribe Now" go back to previous page

ProfileScreen:
- redesign menu item

+ContactUsScreen replace security(deleted)

+TermPrivacyScreen replace HelpSupport(deleted)

and update in App.tsx, navigation.d.ts(types folder)

from BudgetApp(v.1.0.2) --> BudgetApp(v.1.0.3) edited by kongphop

BillDetailsScreen:
- edit the bill page so that you can select the account you want to pay the bill for.

from BudgetApp(v.1.0.3) --> BudgetApp(v.1.0.4) edited by Supawat

AccountsScreen:
- Fix saving goal combine with total balance in saving type account.
AccountDetailsScreen:
- Change design of saving type account to separate between saving goal and total balance.
AddAccountScreen:
- separate between saving goal and total balance when create account.
DashboardScreen:
- show an actual data.
ReportScreen:
- show an actual data.

BudgetApp(V.1.0.4)
-Add Minor Check when user want to Sign Out , ask if user really want to logging out

BudgetApp(V.1.0.5)
-pop up when money not enough 
-display data in account screen and bill(still have issue with account type saving)
-expense detail & income detail data 

BudgetApp(v.1.0.6)
-display data in account screen type saving 

BudgetApp(V.1.0.7)
- consistant between account page and add account page
- Drop Payment method in add Bill
- In Bill detail screen change payment method to account
- fix comfirmpayment text
- after pay bill and expense in account and dashboard

BudgetApp(v.1.0.7.5) - merge with Previous One
- remove Onboarding Screen that have non-existed function
- Add Popup to ask user when user clicked on LogOut Button

BudgetApp(V.1.0.8) edit by kongphop
- Fix it so that when you subscribe, the icon will show that you have subscribed.
- Fixed the delete button to be usable.
- Sign out button has been fixed to ask before exiting.

from BudgetApp(v.1.0.8) --> BudgetApp(v.1.0.9)

AddBillScreen:
- redesign calendar

BudgetApp(V.1.1.0) edit by phurinath

//AddAccountScreen.tsx
- fix Current Balance & Goal Balance input to be number only
//AddBillScreen.tsx
- fix Amount input to be number only
//AccountDetailScreen.tsx
- change account card's color
//ReportScreen.tsx
- add margin on top of report card
//BillScreen.tsx
- add margin on top of filter

BudgetApp(V.1.1.1) edited by Siwagorn
-Add Data Deletion Function
-Add Actual Function To Bill Reminder
-Remove Some of the Onboarding Screen that missing due to version mismatched