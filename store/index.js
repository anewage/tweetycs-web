export const strict = false
function initialState() {
  return {
    aggregatedTopics: {
      group_topics: [],
      theme_topics: []
    },
    aggregatedKeywords: {
      themes: [],
      groups: []
    },
    aggregatedUsers: [],
    topics: [],
    rawTweets: [],
    limit: 400,
    scenarios: [
      {
        id: 'phealth',
        title: 'Public Health',
        subtitle: 'Causes of mortality, diseases, natural disasters, and more',
        color: 'orange',
        consuming: false,
        cloud: '/public-health.png',
        channels: [
          {
            id: 'neoplasms',
            title: 'Cancers - Neoplasms',
            keywords: [
              'Pharyngeal Cancer',
              'Esophageal Cancer',
              'Prostate Cancer',
              'Gallbladder Cancer',
              'Trachea cancer',
              'Kidney cancer',
              'Laryngeal cancer',
              'Liver cancer',
              'Urinary Organ Cancer',
              'Lung Cancer',
              'Stomach Cancer',
              'Uterine Cancer',
              'Mouth Cancer',
              'Biliary Tract Cancer',
              'Bladder Cancer',
              'Brain Cancer',
              'Breast Cancer',
              'Nasopharyngeal Cancer',
              'Cervical Cancer',
              'Nervous System Cancer',
              'Oropharyngeal Cancer',
              'Colon Cancer',
              'Ovarian Cancer',
              'Pancreatic Cancer',
              'Non-Hodgkin Lymphoma',
              'Multiple Myeloma',
              'Leukemia'
            ]
          },
          {
            id: 'diarrhea',
            title:
              'Diarrhea, Lower Respiratory Infections, Meningitis, and Other Common Infectious Diseases',
            keywords: [
              'Diarrhea Diseases',
              'Typhoid',
              'Pneumonia',
              'Influenza',
              'Bronchitis',
              'Whooping cough',
              'Tetanus',
              'Meningitis',
              'Measles',
              'Encephalitis'
            ]
          },
          {
            id: 'hiv',
            title: 'HIV/AIDS and Tuberculosis',
            keywords: ['Tuberculosis', 'HIV/AIDS']
          },
          {
            id: 'unintentional',
            title: 'Unintentional Injuries other Than Transport Injuries',
            keywords: [
              'Heat Death',
              'Poisonings',
              'Fire Death',
              'Falls',
              'Drowning'
            ]
          },
          {
            id: 'respiratory',
            title: 'Chronic Respiratory Diseases',
            keywords: [
              'Chronic Obstructive Pulmonary Disease',
              'Asthma',
              'Pneumoconiosis',
              'Diffuse Parenchymal Lung Disease',
              'Pulmonary Sarcoidosis'
            ]
          },
          {
            id: 'diabetes',
            title: 'Diabetes, Urogenital, Blood, And Endocrine Diseases',
            keywords: [
              'Diabetes',
              'Male Infertility',
              'Kidney Disease',
              'Glomerulonephritis',
              'Urinary disease'
            ]
          },
          {
            id: 'mental',
            title: 'Mental and Behavioral Disorders',
            keywords: ['Drug Overdose', 'Alcohol Use Disorders']
          },
          {
            id: 'other_communicable',
            title:
              'Other communicable, maternal, neonatal, and nutritional disorders',
            keywords: ['Syphilis', 'STDs', 'Hepatitis']
          },
          {
            id: 'maternal',
            title: 'Maternal Disorders',
            keywords: [
              'Maternal disorders',
              'Abortion',
              'Maternal Hemorrhage',
              'Pregnancy Hypertensive'
            ]
          },
          {
            id: 'tropical',
            title: 'Neglected Tropical Diseases and Malaria',
            keywords: [
              'Tropical',
              'Ebola',
              'Dengue',
              'Chikungunya',
              'Chagas',
              'Malaria'
            ]
          },
          {
            id: 'non_communicable',
            title: 'Other non-communicable Diseases',
            keywords: ['Skin Disease', 'Skin Melanoma', 'Congenital Anomalies']
          },
          {
            id: 'neurological',
            title: 'Neurological disorders',
            keywords: [
              'Multiple Sclerosis',
              'Parkinsons Disease',
              'Migraine',
              'Epilepsy',
              'Alzheimer'
            ]
          },
          {
            id: 'musculoskeletal',
            title: 'Musculoskeletal Disorders',
            keywords: [
              'Rheumatoid Arthritis',
              'Osteoarthritis',
              'Neck Pain',
              'Low Back Pain',
              'Gout'
            ]
          },
          {
            id: 'neonatal',
            title: 'Neonatal disorders',
            keywords: [
              'Sepsis',
              'Preterm Birth Complications',
              'Neonatal Encephalopathy'
            ]
          },
          {
            id: 'cardiovascular',
            title: 'Cardiovascular and circulatory diseases',
            keywords: [
              'Myocarditis',
              'Ischemic Stroke',
              'Hemorrhagic Stroke',
              'Rheumatic Heart',
              'Peripheral Vascular Disease',
              'Peripheral Arterial Disease',
              'Ischemic Heart',
              'Hypertensive Heart Disease',
              'Endocarditis',
              'Cardiomyopathy',
              'Atrial Flutter',
              'Atrial Fibrillation',
              'Aortic Aneurysm'
            ]
          },
          {
            id: 'self_harm',
            title: 'Self-harm and interpersonal violence',
            keywords: ['Self-Harm', 'Interpersonal Violence']
          },
          {
            id: 'digestive',
            title: 'Digestive Diseases (Except Cirrhosis)',
            keywords: [
              'Intestinal Obstruction',
              'Bile Duct Disease',
              'Peptic Ulcer',
              'Paralytic Ileus',
              'Pancreatitis',
              'Gall Bladder'
            ]
          },
          {
            id: 'liver_cirrhosis',
            title: 'Cirrhosis of the liver',
            keywords: ['Liver Cirrhosis']
          },
          {
            id: 'nutritional',
            title: 'Nutritional Deficiencies',
            keywords: ['Protein-Energy Malnutrition', 'Iron-Deficiency Anemia']
          },
          {
            id: 'nature',
            title: 'Forces of nature, war, and legal intervention',
            keywords: [
              'Typhoon Death',
              'Tsunami Death',
              'Tornado Death',
              'Hurricane Death',
              'Earthquake Death'
            ]
          },
          {
            id: 'transport',
            title: 'Transport injuries',
            keywords: ['Transport Injury', 'Road Injury']
          }
        ]
      },
      {
        id: 'politics',
        title: 'Politics',
        subtitle: 'Debates about policies, political parties, and more',
        color: 'purple',
        consuming: false,
        cloud: '/politics.png',
        channels: []
      }
    ]
  }
}
export const state = () => ({
  aggregatedTopics: {
    group_topics: [],
    theme_topics: []
  },
  aggregatedKeywords: {
    themes: [],
    groups: []
  },
  aggregatedUsers: [],
  topics: [],
  rawTweets: [],
  limit: 400,
  scenarios: [
    {
      id: 'phealth',
      title: 'Public Health',
      subtitle: 'Causes of mortality, diseases, natural disasters, and more',
      color: 'orange',
      consuming: false,
      cloud: '/public-health.png',
      channels: [
        {
          id: 'neoplasms',
          title: 'Cancers - Neoplasms',
          keywords: [
            'Pharyngeal Cancer',
            'Esophageal Cancer',
            'Prostate Cancer',
            'Gallbladder Cancer',
            'Trachea cancer',
            'Kidney cancer',
            'Laryngeal cancer',
            'Liver cancer',
            'Urinary Organ Cancer',
            'Lung Cancer',
            'Stomach Cancer',
            'Uterine Cancer',
            'Mouth Cancer',
            'Biliary Tract Cancer',
            'Bladder Cancer',
            'Brain Cancer',
            'Breast Cancer',
            'Nasopharyngeal Cancer',
            'Cervical Cancer',
            'Nervous System Cancer',
            'Oropharyngeal Cancer',
            'Colon Cancer',
            'Ovarian Cancer',
            'Pancreatic Cancer',
            'Non-Hodgkin Lymphoma',
            'Multiple Myeloma',
            'Leukemia'
          ]
        },
        {
          id: 'diarrhea',
          title:
            'Diarrhea, Lower Respiratory Infections, Meningitis, and Other Common Infectious Diseases',
          keywords: [
            'Diarrhea Diseases',
            'Typhoid',
            'Pneumonia',
            'Influenza',
            'Bronchitis',
            'Whooping cough',
            'Tetanus',
            'Meningitis',
            'Measles',
            'Encephalitis'
          ]
        },
        {
          id: 'hiv',
          title: 'HIV/AIDS and Tuberculosis',
          keywords: ['Tuberculosis', 'HIV/AIDS']
        },
        {
          id: 'unintentional',
          title: 'Unintentional Injuries other Than Transport Injuries',
          keywords: [
            'Heat Death',
            'Poisonings',
            'Fire Death',
            'Falls',
            'Drowning'
          ]
        },
        {
          id: 'respiratory',
          title: 'Chronic Respiratory Diseases',
          keywords: [
            'Chronic Obstructive Pulmonary Disease',
            'Asthma',
            'Pneumoconiosis',
            'Diffuse Parenchymal Lung Disease',
            'Pulmonary Sarcoidosis'
          ]
        },
        {
          id: 'diabetes',
          title: 'Diabetes, Urogenital, Blood, And Endocrine Diseases',
          keywords: [
            'Diabetes',
            'Male Infertility',
            'Kidney Disease',
            'Glomerulonephritis',
            'Urinary disease'
          ]
        },
        {
          id: 'mental',
          title: 'Mental and Behavioral Disorders',
          keywords: ['Drug Overdose', 'Alcohol Use Disorders']
        },
        {
          id: 'other_communicable',
          title:
            'Other communicable, maternal, neonatal, and nutritional disorders',
          keywords: ['Syphilis', 'STDs', 'Hepatitis']
        },
        {
          id: 'maternal',
          title: 'Maternal Disorders',
          keywords: [
            'Maternal disorders',
            'Abortion',
            'Maternal Hemorrhage',
            'Pregnancy Hypertensive'
          ]
        },
        {
          id: 'tropical',
          title: 'Neglected Tropical Diseases and Malaria',
          keywords: [
            'Tropical',
            'Ebola',
            'Dengue',
            'Chikungunya',
            'Chagas',
            'Malaria'
          ]
        },
        {
          id: 'non_communicable',
          title: 'Other non-communicable Diseases',
          keywords: ['Skin Disease', 'Skin Melanoma', 'Congenital Anomalies']
        },
        {
          id: 'neurological',
          title: 'Neurological disorders',
          keywords: [
            'Multiple Sclerosis',
            'Parkinsons Disease',
            'Migraine',
            'Epilepsy',
            'Alzheimer'
          ]
        },
        {
          id: 'musculoskeletal',
          title: 'Musculoskeletal Disorders',
          keywords: [
            'Rheumatoid Arthritis',
            'Osteoarthritis',
            'Neck Pain',
            'Low Back Pain',
            'Gout'
          ]
        },
        {
          id: 'neonatal',
          title: 'Neonatal disorders',
          keywords: [
            'Sepsis',
            'Preterm Birth Complications',
            'Neonatal Encephalopathy'
          ]
        },
        {
          id: 'cardiovascular',
          title: 'Cardiovascular and circulatory diseases',
          keywords: [
            'Myocarditis',
            'Ischemic Stroke',
            'Hemorrhagic Stroke',
            'Rheumatic Heart',
            'Peripheral Vascular Disease',
            'Peripheral Arterial Disease',
            'Ischemic Heart',
            'Hypertensive Heart Disease',
            'Endocarditis',
            'Cardiomyopathy',
            'Atrial Flutter',
            'Atrial Fibrillation',
            'Aortic Aneurysm'
          ]
        },
        {
          id: 'self_harm',
          title: 'Self-harm and interpersonal violence',
          keywords: ['Self-Harm', 'Interpersonal Violence']
        },
        {
          id: 'digestive',
          title: 'Digestive Diseases (Except Cirrhosis)',
          keywords: [
            'Intestinal Obstruction',
            'Bile Duct Disease',
            'Peptic Ulcer',
            'Paralytic Ileus',
            'Pancreatitis',
            'Gall Bladder'
          ]
        },
        {
          id: 'liver_cirrhosis',
          title: 'Cirrhosis of the liver',
          keywords: ['Liver Cirrhosis']
        },
        {
          id: 'nutritional',
          title: 'Nutritional Deficiencies',
          keywords: ['Protein-Energy Malnutrition', 'Iron-Deficiency Anemia']
        },
        {
          id: 'nature',
          title: 'Forces of nature, war, and legal intervention',
          keywords: [
            'Typhoon Death',
            'Tsunami Death',
            'Tornado Death',
            'Hurricane Death',
            'Earthquake Death'
          ]
        },
        {
          id: 'transport',
          title: 'Transport injuries',
          keywords: ['Transport Injury', 'Road Injury']
        }
      ]
    },
    {
      id: 'politics',
      title: 'Politics',
      subtitle: 'Debates about policies, political parties, and more',
      color: 'purple',
      consuming: false,
      cloud: '/politics.png',
      channels: []
    }
  ]
})

export const mutations = {
  reset(state) {
    const initial = initialState()
    Object.keys(initial).forEach(key => {
      state[key] = initial[key]
    })
  },
  updateAggregatedTopics(state, data) {
    state.aggregatedTopics = data
  },
  updateAggregatedUsers(state, data) {
    state.aggregatedUsers = data
  },
  updateAggregatedKeywords(state, data) {
    state.aggregatedKeywords = data
  },
  updateTopics(state, data) {
    // Sort keywords
    for (const channel of data) {
      channel.keywords = channel.keywords.sort()
    }
    // Sort channels
    data = data.sort((a, b) => {
      return a.id > b.id ? 1 : -1
    })
    state.topics = data
  },
  updateSelectedTopic(state, data) {
    // If the topic already exists
    if (state.topics.includes(a => a.id === data.channel))
      state.topics.find(a => a.id === data.channel).keywords = data.keywords
    // otherwise
    else
      state.topics.push({
        id: data.channel.toLowerCase(),
        title: data.channel,
        keywords: data.keywords
      })
  },
  updateRawTweets(state, data) {
    state.rawTweets = data
  },
  addToRawTweets(state, data) {
    state.rawTweets = [...state.rawTweets, ...data]
    // if (state.rawTweets.length > state.limit)
    //   state.rawTweets.splice(-state.limit)
  },
  updateScenarios(state, data) {
    state.scenarios = data
  },
  updateConsumingScenario(state, data) {
    const found = state.scenarios.find(sc => sc.id === data.id)
    if (found) found.consuming = data.flag
    // eslint-disable-next-line no-console
    console.log('done', data.id, data.flag)
  }
}
