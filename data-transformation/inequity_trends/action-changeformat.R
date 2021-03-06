## library packages ----
packages <- c("tidyverse", "readxl", "ggthemes", "scales", "purrr", "haven", "knitr", "RColorBrewer",
              "broom", "stargazer", "lfe", "glmnet", "rsample", "randomForest", "hdm", "pROC", "ggrepel",
              "questionr", "rJava", "xlsx", "Hmisc", "DescTools", "ggThemeAssist", "colourpicker")
lapply(packages, library, character.only = TRUE)


# load dataset and gather it
for (ix in 1:5){
  
  data <- read_xlsx("data/input/Final data.xlsx", ix)
  
  fpath <- str_c("data/output/action-data",ix, ".csv")
  new_data <- data %>% 
    gather(key = category, value = share, colnames(data)[-1]) %>% 
    select(category, everything()) %>% 
    write.csv(fpath, row.names = FALSE)
  
}