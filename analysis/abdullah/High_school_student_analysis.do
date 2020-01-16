*Data visualization for high school student, 1st sprint of DP691MA
clear

net install http://www.stata.com/users/kcrow/tab2xl, replace
ssc install tabout, replace
//import dataset and convert first row into variables
import excel "C:\Users\abdul\Desktop\691\Potential project datasets\ASER Pakistan\2018\ITAASER2018Child.xlsx", sheet("Ch_HH_VMAP") firstrow

//only keep variables related to gender, region, enrollment status, and assessment outcomes in reading and mathematics
keep RID C001 C002 C003 C010 C012

//rename variables and their labels  
rename RID Region
label variable Region Region
rename C001 Age
label variable Age Age
rename C002 Gender
label variable Gender Gender
rename C003 Enrollment_status
label variable Enrollment_status Enrollment_status
rename C010 Reading_level
label variable Reading_level Reading_level
rename C012 Mathematics_level
label variable Mathematics_level Mathematics_level

//keep only observations for which age is between 8 and 11 years
keep if Age == 8 | Age == 9 | Age == 10 | Age == 11

//Change Region Identifiers to the names of regions
//recode Region 6 = Kashmir 

//recoding variables
recode Enrollment_status 2 = 1 //This treats children who were never enrolled or who dropped out as one category
recode Gender -1 = 1

//generate tabulation tables for the variables of interest and export them to excel
 
tabout Gender Reading_level using Gender_Reading
tabout Gender Mathematics_level using Gender_Math

tabout Region Reading_level using Region_Reading
tabout Region Mathematics_level using Region_Math


tabout Enrollment_status Reading_level using Enrollment_Reading
tabout Enrollment_status Mathematics_level using Enrollment_Math

//In excel, these tables were converted to percentages, and stacked and clustered bar charts were created.


