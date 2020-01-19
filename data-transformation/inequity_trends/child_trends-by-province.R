## library packages ----
packages <- c("tidyverse", "readxl", "ggthemes", "scales", "purrr", "haven", "knitr", "RColorBrewer",
              "broom", "stargazer", "lfe", "glmnet", "rsample", "randomForest", "hdm", "pROC", "ggrepel",
              "questionr", "rJava", "xlsx", "Hmisc", "DescTools", "ggThemeAssist", "colourpicker")
lapply(packages, library, character.only = TRUE)


## load dataset ----
# load child dataset
row_child_2018 <- read_xlsx("data/input/child_2018.xlsx", 1L)
row_child_2016 <- read_csv("data/input/child_2016.csv")
row_vmsurvey_2018 <- read_csv("data/input/vmsurvey_2018.csv")
row_vmsurvey_2016 <- read_csv("data/input/vmsurvey_2016.csv")

# make variables lower-case
names(row_child_2018) <- tolower(names(row_child_2018))
names(row_child_2016) <- tolower(names(row_child_2016))
names(row_vmsurvey_2018) <- tolower(names(row_vmsurvey_2018))
names(row_vmsurvey_2016) <- tolower(names(row_vmsurvey_2016))

# privince and district names
vmsurvey_2018 <- row_vmsurvey_2018 %>% 
  select(rid, rname, did, dname)
  
vmsurvey_2016 <- row_vmsurvey_2016 %>% 
  select(rid, rname, did, dname) 

# select variables and filter ages for 8-11 which should corrensponds to grade 4 & 5
# success in these grades ensure the enrollment in grade 6
child_2018 <- row_child_2018 %>% 
  select(syear, area, rid, did, vid, hhid, prid, cid, c001, c003, c010, c012, c013) %>% 
  filter(c001 %in% c(8:11)) %>% 
  left_join(vmsurvey_2018, by = c("rid", "did")) %>% 
  filter(!is.na(dname))

child_2016 <- row_child_2016 %>% 
  select(syear, area, rid, did, vid, hhid, prid, cid, c001, c003, c010, c012, c013) %>% 
  filter(c001 %in% c(8:11)) %>% 
  left_join(vmsurvey_2016, by = c("rid", "did"))%>% 
  filter(!is.na(dname))

# combine 2016 and 2018 dataset into one object and add province/district name
child <- child_2018 %>% 
  bind_rows(child_2016) %>% 
  mutate(enroll = if_else(c003 == 3, 1, 0))

## Province level ----
# summarize the dataset by year and province
child_national_avg <- child %>% 
  group_by(syear) %>% 
  summarise(sample = n(),
            rname = "National",
            enrollment = mean(enroll, na.rm = TRUE) * 100,
            reading = mean(c010, na.rm = TRUE),
            arithmetic = mean(c012, na.rm = TRUE),
            english = mean(c013, na.rm = TRUE))

child_province_avg <- child %>% 
  group_by(syear, rname) %>% 
  summarise(sample = n(),
            dname = "Province",
            enrollment = mean(enroll, na.rm = TRUE) * 100,
            reading = mean(c010, na.rm = TRUE),
            arithmetic = mean(c012, na.rm = TRUE),
            english = mean(c013, na.rm = TRUE))

child_province <- child %>% 
  group_by(syear, rname) %>% 
  summarise(sample = n(),
            enrollment = mean(enroll, na.rm = TRUE) * 100,
            reading = mean(c010, na.rm = TRUE),
            arithmetic = mean(c012, na.rm = TRUE),
            english = mean(c013, na.rm = TRUE)) %>% 
  bind_rows(child_national_avg) %>% 
  arrange(syear, rname)

# enrollment
trend_enrollment <- child_province %>% 
  select(syear, rname, enrollment) %>% 
  spread(key = syear, value = enrollment) %>% 
  rename(year1 = '2016', year2 = '2018') %>% 
  mutate(diff = year2 - year1) %>% 
  arrange(desc(year1))
  
write.csv(trend_enrollment, "data/output/trend_enrollment.csv", row.names = FALSE)

# reading
trend_reading <- child_province %>% 
  select(syear, rname, reading) %>% 
  spread(key = syear, value = reading) %>% 
  rename(year1 = '2016', year2 = '2018') %>% 
  mutate(diff = year2 - year1) %>% 
  arrange(desc(year1))

write.csv(trend_reading, "data/output/trend_reading.csv", row.names = FALSE)

# arithmetic
trend_arithmetic <- child_province %>% 
  select(syear, rname, arithmetic) %>% 
  spread(key = syear, value = arithmetic) %>% 
  rename(year1 = '2016', year2 = '2018') %>% 
  mutate(diff = year2 - year1) %>% 
  arrange(desc(year1))

write.csv(trend_arithmetic, "data/output/trend_arith.csv", row.names = FALSE)

q# english
trend_english <- child_province %>% 
  select(syear, rname, english) %>% 
  spread(key = syear, value = english) %>% 
  rename(year1 = '2016', year2 = '2018') %>% 
  mutate(diff = year2 - year1) %>% 
  arrange(desc(year1))

write.csv(trend_english, "data/output/trend_eng.csv", row.names = FALSE)

