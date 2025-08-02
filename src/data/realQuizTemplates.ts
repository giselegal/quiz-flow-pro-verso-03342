import { QuizFunnel } from '@/types/quiz';

export const realQuizTemplates: Record<string, QuizFunnel> = {
  template1: {
    id: 'template1',
    name: 'Quiz de Estilo Completo',
    pages: [
      {
        id: 'step1',
        title: 'Bem-vindo(a)!',
        type: 'intro',
        progress: 0,
        showHeader: false,
        showProgress: false,
        components: [
          {
            id: 'logo1',
            type: 'logo',
            data: {
              src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1701880843/logo_cakto_quiz_ofpzxd.svg',
              alt: 'Cakto Quiz Logo',
              width: 120
            },
            style: {
              textAlign: 'center',
              marginBottom: '20px'
            }
          },
          {
            id: 'title1',
            type: 'title',
            data: {
              text: 'Descubra seu estilo e receba dicas personalizadas!'
            },
            style: {
              fontSize: '24px',
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#333'
            }
          },
          {
            id: 'subtitle1',
            type: 'subtitle',
            data: {
              text: 'Responda algumas perguntas rápidas e encontre o estilo que mais combina com você.'
            },
            style: {
              fontSize: '16px',
              textAlign: 'center',
              color: '#666',
              marginBottom: '30px'
            }
          },
          {
            id: 'button1',
            type: 'button',
            data: {
              text: 'Começar o Quiz',
              action: 'next'
            },
            style: {
              backgroundColor: '#B89B7A',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '4px',
              textAlign: 'center',
              cursor: 'pointer',
              display: 'inline-block',
              margin: '0 auto'
            }
          }
        ]
      },
      {
        id: 'step2',
        title: 'Qual o seu tipo de roupa favorita?',
        type: 'question',
        progress: 10,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: 'progress2',
            type: 'progress',
            data: {
              progressValue: 10,
              showPercentage: true
            },
            style: {
              color: '#B89B7A'
            }
          },
          {
            id: 'title2',
            type: 'title',
            data: {
              text: 'Qual o seu tipo de roupa favorita?'
            },
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px'
            }
          },
          {
            id: 'options2',
            type: 'options',
            data: {
              options: [
                {
                  id: '2a',
                  text: 'Conforto, leveza e praticidade no vestir.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp'
                },
                {
                  id: '2b',
                  text: 'Discrição, caimento clássico e sobriedade.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp'
                },
                {
                  id: '2c',
                  text: 'Praticidade com um toque de estilo atual.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp'
                },
                {
                  id: '2d',
                  text: 'Elegância refinada, moderna e sem exageros.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp'
                }
              ],
              multiSelect: true
            },
            style: {}
          },
          {
            id: 'button2',
            type: 'button',
            data: {
              text: 'Próxima Pergunta',
              action: 'next'
            },
            style: {
              backgroundColor: '#B89B7A',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }
        ]
      },
      {
        id: 'step3',
        title: 'Resuma a sua personalidade',
        type: 'question',
        progress: 20,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: 'progress3',
            type: 'progress',
            data: {
              progressValue: 20,
              showPercentage: true
            },
            style: {
              color: '#B89B7A'
            }
          },
          {
            id: 'title3',
            type: 'title',
            data: {
              text: 'Resuma a sua personalidade'
            },
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px'
            }
          },
          {
            id: 'options3',
            type: 'options',
            data: {
              options: [
                {
                  id: '3a',
                  text: 'Informal, espontânea, alegre, essencialista.'
                },
                {
                  id: '3b',
                  text: 'Conservadora, séria, organizada.'
                },
                {
                  id: '3c',
                  text: 'Informada, ativa, prática.'
                },
                {
                  id: '3d',
                  text: 'Exigente, sofisticada, seletiva.'
                }
              ],
              multiSelect: true
            },
            style: {}
          },
          {
            id: 'button3',
            type: 'button',
            data: {
              text: 'Próxima Pergunta',
              action: 'next'
            },
            style: {
              backgroundColor: '#B89B7A',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }
        ]
      },
      {
        id: 'step4',
        title: 'Qual visual você mais se identifica?',
        type: 'question',
        progress: 30,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: 'progress4',
            type: 'progress',
            data: {
              progressValue: 30,
              showPercentage: true
            },
            style: {
              color: '#B89B7A'
            }
          },
          {
            id: 'title4',
            type: 'title',
            data: {
              text: 'Qual visual você mais se identifica?'
            },
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px'
            }
          },
          {
            id: 'options4',
            type: 'options',
            data: {
              options: [
                {
                  id: '4a',
                  text: 'Visual leve, despojado e natural.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp'
                },
                {
                  id: '4b',
                  text: 'Visual clássico e tradicional.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp'
                },
                {
                  id: '4c',
                  text: 'Visual casual com toque atual.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp'
                },
                {
                  id: '4d',
                  text: 'Visual refinado e imponente.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp'
                }
              ],
              multiSelect: true
            },
            style: {}
          },
          {
            id: 'button4',
            type: 'button',
            data: {
              text: 'Próxima Pergunta',
              action: 'next'
            },
            style: {
              backgroundColor: '#B89B7A',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }
        ]
      },
      {
        id: 'step5',
        title: 'Quais detalhes você gosta?',
        type: 'question',
        progress: 40,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: 'progress5',
            type: 'progress',
            data: {
              progressValue: 40,
              showPercentage: true
            },
            style: {
              color: '#B89B7A'
            }
          },
          {
            id: 'title5',
            type: 'title',
            data: {
              text: 'Quais detalhes você gosta?'
            },
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px'
            }
          },
          {
            id: 'options5',
            type: 'options',
            data: {
              options: [
                {
                  id: '5a',
                  text: 'Minimalismo e funcionalidade.'
                },
                {
                  id: '5b',
                  text: 'Cortes clássicos e cores neutras.'
                },
                {
                  id: '5c',
                  text: 'Design moderno e tecidos tecnológicos.'
                },
                {
                  id: '5d',
                  text: 'Alfaiataria impecável e acessórios sofisticados.'
                }
              ],
              multiSelect: true
            },
            style: {}
          },
          {
            id: 'button5',
            type: 'button',
            data: {
              text: 'Próxima Pergunta',
              action: 'next'
            },
            style: {
              backgroundColor: '#B89B7A',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }
        ]
      },
      {
        id: 'step6',
        title: 'Quais estampas você mais se identifica?',
        type: 'question',
        progress: 50,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: 'progress6',
            type: 'progress',
            data: {
              progressValue: 50,
              showPercentage: true
            },
            style: {
              color: '#B89B7A'
            }
          },
          {
            id: 'title6',
            type: 'title',
            data: {
              text: 'Quais estampas você mais se identifica?'
            },
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px'
            }
          },
          {
            id: 'options6',
            type: 'options',
            data: {
              options: [
                {
                  id: '6a',
                  text: 'Listras simples ou sem estampa.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/19_rqsmym.webp'
                },
                {
                  id: '6b',
                  text: 'Xadrez clássico ou listras discretas.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/20_fxtgdv.webp'
                },
                {
                  id: '6c',
                  text: 'Estampas geométricas modernas.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/21_ccnrbe.webp'
                },
                {
                  id: '6d',
                  text: 'Estampas sofisticadas e atemporais.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/22_bsdbnc.webp'
                }
              ],
              multiSelect: true
            },
            style: {}
          },
          {
            id: 'button6',
            type: 'button',
            data: {
              text: 'Próxima Pergunta',
              action: 'next'
            },
            style: {
              backgroundColor: '#B89B7A',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }
        ]
      },
      {
        id: 'step7',
        title: 'Qual casaco é seu favorito?',
        type: 'question',
        progress: 60,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: 'progress7',
            type: 'progress',
            data: {
              progressValue: 60,
              showPercentage: true
            },
            style: {
              color: '#B89B7A'
            }
          },
          {
            id: 'title7',
            type: 'title',
            data: {
              text: 'Qual casaco é seu favorito?'
            },
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px'
            }
          },
          {
            id: 'options7',
            type: 'options',
            data: {
              options: [
                {
                  id: '7a',
                  text: 'Cardigã de lã ou casaco de moletom.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/31_rtvivb.webp'
                },
                {
                  id: '7b',
                  text: 'Blazer estruturado em cor neutra.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/32_r2jkkq.webp'
                },
                {
                  id: '7c',
                  text: 'Blazer oversized e moderno.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/33_b5xvpr.webp'
                },
                {
                  id: '7d',
                  text: 'Blazer alfaiataria com caimento impecável.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/34_rnngfm.webp'
                }
              ],
              multiSelect: true
            },
            style: {}
          },
          {
            id: 'button7',
            type: 'button',
            data: {
              text: 'Próxima Pergunta',
              action: 'next'
            },
            style: {
              backgroundColor: '#B89B7A',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }
        ]
      },
      {
        id: 'step8',
        title: 'Qual sua calça favorita?',
        type: 'question',
        progress: 70,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: 'progress8',
            type: 'progress',
            data: {
              progressValue: 70,
              showPercentage: true
            },
            style: {
              color: '#B89B7A'
            }
          },
          {
            id: 'title8',
            type: 'title',
            data: {
              text: 'Qual sua calça favorita?'
            },
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px'
            }
          },
          {
            id: 'options8',
            type: 'options',
            data: {
              options: [
                {
                  id: '8a',
                  text: 'Jeans reto ou mom jeans confortável.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/39_bbnekh.webp'
                },
                {
                  id: '8b',
                  text: 'Calça social reta em cor neutra.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/40_kzxfon.webp'
                },
                {
                  id: '8c',
                  text: 'Calça wide leg ou culotte moderna.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/41_tebqpg.webp'
                },
                {
                  id: '8d',
                  text: 'Calça alfaiataria com vinco marcado.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/42_ooktql.webp'
                }
              ],
              multiSelect: true
            },
            style: {}
          },
          {
            id: 'button8',
            type: 'button',
            data: {
              text: 'Próxima Pergunta',
              action: 'next'
            },
            style: {
              backgroundColor: '#B89B7A',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }
        ]
      },
      {
        id: 'step9',
        title: 'Qual desses sapatos você tem ou mais gosta?',
        type: 'question',
        progress: 80,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: 'progress9',
            type: 'progress',
            data: {
              progressValue: 80,
              showPercentage: true
            },
            style: {
              color: '#B89B7A'
            }
          },
          {
            id: 'title9',
            type: 'title',
            data: {
              text: 'Qual desses sapatos você tem ou mais gosta?'
            },
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px'
            }
          },
          {
            id: 'options9',
            type: 'options',
            data: {
              options: [
                {
                  id: '9a',
                  text: 'Tênis nude casual e confortável.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_bi6vgf.webp'
                },
                {
                  id: '9b',
                  text: 'Scarpin nude de salto baixo.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/48_ymo1ur.webp'
                },
                {
                  id: '9c',
                  text: 'Sandália dourada com salto bloco.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/49_apcrwa.webp'
                },
                {
                  id: '9d',
                  text: 'Scarpin nude salto alto e fino.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/50_qexxxo.webp'
                }
              ],
              multiSelect: true
            },
            style: {}
          },
          {
            id: 'button9',
            type: 'button',
            data: {
              text: 'Próxima Pergunta',
              action: 'next'
            },
            style: {
              backgroundColor: '#B89B7A',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }
        ]
      },
      {
        id: 'step10',
        title: 'Que tipo de acessórios você gosta?',
        type: 'question',
        progress: 90,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: 'progress10',
            type: 'progress',
            data: {
              progressValue: 90,
              showPercentage: true
            },
            style: {
              color: '#B89B7A'
            }
          },
          {
            id: 'title10',
            type: 'title',
            data: {
              text: 'Que tipo de acessórios você gosta?'
            },
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px'
            }
          },
          {
            id: 'options10',
            type: 'options',
            data: {
              options: [
                {
                  id: '10a',
                  text: 'Pequenos e discretos, às vezes nem uso.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/56_htzoxy.webp'
                },
                {
                  id: '10b',
                  text: 'Brincos pequenos e discretos. Corrente fininha.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735479/57_whzmff.webp'
                },
                {
                  id: '10c',
                  text: 'Acessórios que elevem meu look com um toque moderno.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/61_joafud.webp'
                },
                {
                  id: '10d',
                  text: 'Acessórios sofisticados, joias ou semijoias.',
                  imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735482/60_vzsnps.webp'
                }
              ],
              multiSelect: true
            },
            style: {}
          },
          {
            id: 'button10',
            type: 'button',
            data: {
              text: 'Próxima Pergunta',
              action: 'next'
            },
            style: {
              backgroundColor: '#B89B7A',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }
        ]
      },
      {
        id: 'step11',
        title: 'Você escolhe certos tecidos, principalmente porque eles...',
        type: 'question',
        progress: 100,
        showHeader: true,
        showProgress: true,
        components: [
          {
            id: 'progress11',
            type: 'progress',
            data: {
              progressValue: 100,
              showPercentage: true
            },
            style: {
              color: '#B89B7A'
            }
          },
          {
            id: 'title11',
            type: 'title',
            data: {
              text: 'Você escolhe certos tecidos, principalmente porque eles...'
            },
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px'
            }
          },
          {
            id: 'options11',
            type: 'options',
            data: {
              options: [
                {
                  id: '11a',
                  text: 'São confortáveis e não amassam facilmente.'
                },
                {
                  id: '11b',
                  text: 'Têm qualidade e durabilidade.'
                },
                {
                  id: '11c',
                  text: 'São práticos para o dia a dia.'
                },
                {
                  id: '11d',
                  text: 'Têm acabamento impecável e caimento perfeito.'
                }
              ],
              multiSelect: false
            },
            style: {}
          },
          {
            id: 'button11',
            type: 'button',
            data: {
              text: 'Ver Resultado',
              action: 'result'
            },
            style: {
              backgroundColor: '#B89B7A',
              color: '#fff',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }
          }
        ]
      },
      {
        id: 'result12',
        title: 'Seu Estilo é...',
        type: 'result',
        progress: 100,
        showHeader: true,
        showProgress: false,
        components: [
          {
            id: 'resultTitle',
            type: 'title',
            data: {
              text: 'Seu Estilo é...'
            },
            style: {
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#333',
              textAlign: 'center',
              marginBottom: '20px'
            }
          },
          {
            id: 'resultDescription',
            type: 'text',
            data: {
              text: 'Baseado nas suas respostas, o seu estilo predominante é clássico com toques modernos.
