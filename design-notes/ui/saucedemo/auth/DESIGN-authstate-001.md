# DESIGN-authstate-001.md

1. Where does test auth happen?

in `LoginPage.ts`, in `performLogin`. Fills login fields and clicks login button.

NOTE: Login must be done at UI level since there is no auth API endpoint, based on Network inspector readout
