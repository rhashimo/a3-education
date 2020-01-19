## library packages ----
packages <- c("tidyverse", "readxl", "ggthemes", "scales", "purrr", "haven", "knitr", "RColorBrewer",
              "broom", "stargazer", "lfe", "glmnet", "rsample", "randomForest", "hdm", "pROC", "ggrepel",
              "questionr", "rJava", "xlsx", "Hmisc", "DescTools", "ggThemeAssist", "colourpicker")
lapply(packages, library, character.only = TRUE)


## load dataset ----
# load child dataset
row_child_2018 <- read_xlsx("data/input/child_2018.xlsx", 1L)

# select variables and filter ages for 8-11 which should corrensponds to grade 4 & 5
# success in these grades ensure the enrollment in grade 6
child_2018 <- row_child_2018 %>% 
  select(Syear, AREA, RID, DID, VID, HHID, PRID, CID, C001, C002, C003, C004, C005, C006, C010, C012, C013, WSCORE, WINDEX) %>% 
  filter(C001 %in% c(8:11), !is.na(WINDEX)) %>% 
  mutate(WINDEX = recode(WINDEX, "1" = "Poor", "2" = "Relatively Poor", "3" = "Relatively Rich", "4" = "Rich"),
         WINDEX = fct_relevel(WINDEX, "Poor", "Relatively Poor", "Relatively Rich", "Rich"))

## C003: Edcation status ----
child_status <- child_2018 %>% 
  filter(!is.na(C003)) %>% 
  mutate(C003 = recode(C003, "1" = "Never enrolled", "2" = "Drop-out", "3" = "Currently enrolled"),
         C003 = fct_relevel(C003, "Never enrolled", "Drop-out", "Currently enrolled")) %>% 
  group_by(WINDEX, C003) %>% 
  summarise(n = n())

child_status %>% 
  group_by(WINDEX) %>% 
  mutate(ratio = n / sum(n)) %>% 
  select(-n) %>% 
  spread(key = C003, value = ratio) %>% 
  write.csv("data/output/child_status.csv", row.names = FALSE)

ggplot(child_status, aes(x = WINDEX, y = n, fill = C003)) +
  geom_bar(stat = "identity", position = "fill") +
  scale_y_continuous(labels = percent) +
  theme_minimal() +
  scale_fill_brewer(palette = "Spectral") +
  labs(x = "Quatile of Household's Wealth",
       y = "",
       title = "Non-enrollment and drop-out are more common among children in poor households") +
  ggsave(filename = "figures/C003_education-status.png", width = 8, height = 5)

## C006: Currently enrolled: Institution Type ----
child_inst <- child_2018 %>% 
  filter(!is.na(C006), C006 != 0) %>% 
  mutate(C006 = recode(C006, "1" = "Government", "2" = "Private", "3" = "Madrasah"," 4" = "Other"),
         C006 = fct_relevel(C006, "Other", "Madrasah", "Private", "Government")) %>% 
  group_by(WINDEX, C006) %>% 
  summarise(n = n())

child_inst %>% 
  group_by(WINDEX) %>% 
  mutate(ratio = n / sum(n)) %>% 
  select(-n) %>% 
  spread(key = C006, value = ratio) %>% 
  write.csv("data/output/child_inst.csv", row.names = FALSE)

ggplot(child_inst, aes(x = WINDEX, y = n, fill = C006)) +
  geom_bar(stat = "identity", position = "fill") +
  scale_y_continuous(labels = percent) +
  theme_minimal() +
  scale_fill_brewer(palette = "Spectral") +
  labs(x = "Quatile of Household's Wealth",
       y = "",
       title = "Public school is more popular choice for rich kids") +
  ggsave(filename = "figures/C006_institution-type.png", width = 8, height = 5)

## C010: Basic Learning Levels ----
child_basic <- child_2018 %>% 
  filter(!is.na(C010)) %>% 
  mutate(C010 = recode(C010, "1" = "Beginner/Nothing", "2" = "letters", "3" = "words"," 4" = "sentences", "5" = "story"),
         C010 = fct_relevel(C010, "Beginner/Nothing", "letters", "words", "sentences", "story")) %>% 
  group_by(WINDEX, C010) %>% 
  summarise(n = n())

child_basic %>% 
  group_by(WINDEX) %>% 
  mutate(ratio = n / sum(n)) %>% 
  select(-n) %>% 
  spread(key = C010, value = ratio) %>% 
  write.csv("data/output/child_basic.csv", row.names = FALSE)

ggplot(child_basic, aes(x = WINDEX, y = n, fill = C010)) +
  geom_bar(stat = "identity", position = "fill") +
  scale_y_continuous(labels = percent) +
  theme_minimal() +
  scale_fill_brewer(palette = "Spectral") +
  labs(x = "Quatile of Household's Wealth",
       y = "",
       title = "Poor kids have less literacy on local/national language readings") +
  ggsave(filename = "figures/C010_basic-learning-level.png", width = 8, height = 5)

## C012: Arithmetic Levels ----
child_arith <- child_2018 %>% 
  filter(!is.na(C012)) %>% 
  mutate(C012 = recode(C012, "1" = "Beginner/Nothing", "2" = "Recognition of 1-9", "3" = "Recognition of 10-99",
                       "4" = "Recognition of 100-200", "5" = "Subtraction", "6" = "Division"),
         C012 = fct_relevel(C012, "Beginner/Nothing", "Recognition of 1-9", "Recognition of 10-99",
                            "Recognition of 100-200", "Subtraction", "Division")) %>% 
  group_by(WINDEX, C012) %>% 
  summarise(n = n())

child_arith %>% 
  group_by(WINDEX) %>% 
  mutate(ratio = n / sum(n)) %>% 
  select(-n) %>% 
  spread(key = C012, value = ratio) %>% 
  write.csv("data/output/child_arith.csv", row.names = FALSE)

ggplot(child_arith, aes(x = WINDEX, y = n, fill = C012)) +
  geom_bar(stat = "identity", position = "fill") +
  scale_y_continuous(labels = percent) +
  theme_minimal() +
  scale_fill_brewer(palette = "Spectral") +
  labs(x = "Quatile of Household's Wealth",
       y = "",
       title = "More than 50% of poor kids don't understand subtraction and division") +
  ggsave(filename = "figures/C012_arithmetic-level.png", width = 8, height = 5)

## C013: English Levels ----
child_eng <- child_2018 %>% 
  filter(!is.na(C013)) %>% 
  mutate(C013 = recode(C013, "1" = "Beginner/Nothing", "2" = "Capital letters", "3" = "Small letters",
                       "4" = "Words", "5" = "Sentences"),
         C013 = fct_relevel(C013, "Beginner/Nothing", "Capital letters", "Small letters", "Words", "Sentences")) %>% 
  group_by(WINDEX, C013) %>% 
  summarise(n = n())

child_eng %>% 
  group_by(WINDEX) %>% 
  mutate(ratio = n / sum(n)) %>% 
  select(-n) %>% 
  spread(key = C013, value = ratio) %>% 
  write.csv("data/output/child_eng.csv", row.names = FALSE)

ggplot(child_eng, aes(x = WINDEX, y = n, fill = C013)) +
  geom_bar(stat = "identity", position = "fill") +
  scale_y_continuous(labels = percent) +
  theme_minimal() +
  scale_fill_brewer(palette = "Spectral") +
  labs(x = "Quatile of Household's Wealth",
       y = "",
       title = "Wealth gap is wider in English level compared to other metrics") +
  ggsave(filename = "figures/C013_english-level.png", width = 8, height = 5)
