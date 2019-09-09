# Status Type in Pokemon attack
### Hexadecimal code that we have in moves.json - move[4]

https://essentialsdocs.fandom.com/wiki/Function_codes

Functions that we need to take care for the first generation are:

* 000 n/w
* 001 n/w

SLEEP     = 1
POISON    = 2
BURN      = 3
PARALYSIS = 4
FROZEN    = 5

### **34** STATUS CHANGE

### Status Problem
* 003 Sleep Effect **✓**
* 005 and 006 Poison Effect **✓**
* 007 Paralyzes the target. 100% **✓**
* 009 Paralyzes the target. 10% **✓**
* 00A. Burn the target. 100% **✓**
* 00B. Burn the target. 10% **✓**
* 00C and 00D. Freeze the target. 100% **✓**
* 00E. Freeze the target. 10% **✓**
* 00F, 010, 011 and 012. Causes the target to flinch **✓**
* 013 and 015 Confuses the target. 100% **✓**
* 014 Confuses the target. 10% **✓**
* 017 Burn, Freeze or paralyse. 50% **✓**
* 018 Remove all status. 100% **✓**
* 019 Remove all status of all the team. **✓**
* 050, 051 Remove all stats

### Ally Stats Change
* 02E. Raise up attack **✓**
* 02F. Raise up defense **✓**
* 030 and 034 Raise up speed **✓**
* 032 Raise up special attack **✓**
* 033 Raise up special defense **✓**

### Enemy Stats Change
* 042 Decrease attack 10% **✓**
* 043 Decrease defense 10% **✓** 
* 044 Decrease speed 10% **✓**
* 045 Decrease special attack 10% **✓**
* 046 Decrease special defense 10% **✓**
* 093 Increase attack each turn **✓** 

### Healing Change
* 0D5. Gain 50% of it's maxHP **✓**
* 0D8. Gain 25% of it's maxHP **✓**
* 0D9. Gain 100% of it's maxHP but fall asleep 3 turn **✓**
* 0DC. Gain 12.5% of it's maxHP and enemy lose this same quantity each turn **✓**
* 0DD. Gain 50% of PH of the damage that he did to the enemy. **✓**
* 0DE. Gain 50% of PH of the damage that he did to the enemy. Must be in sleep status. **✓**

### Other Status change
* 05C. Mimic. use the last move used by enemy.
* 05E and 05F. Change type to randomly one based in one type of the four current attack.
* 069 Transformation. Change to the target pokemon. clone this one
* 0E0. User Pokemon faint **✓**



n/w: No Work