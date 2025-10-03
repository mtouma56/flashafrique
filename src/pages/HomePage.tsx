import { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import ArticleCard from '../components/ArticleCard';
import { supabase } from '../lib/supabaseClient';

interface Article {
  id: string;
  title: string;
  summary: string;
  image_url: string;
  category: string;
  publish_at: string;
}

const HomePage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);

      const query = supabase
        .from('articles')
        .select('id,title,summary,image_url,category,publish_at')
        .eq('status', 'approved')
        .lte('publish_at', new Date().toISOString())
        .order('publish_at', { ascending: false })
        .limit(6);

      const [{ data, error: fetchError }] = await Promise.all([query]);

      console.log(fetchError);

      if (fetchError) {
        console.error('Supabase fetch error:', fetchError);
        throw fetchError;
      }

      setArticles(data || []);
    } catch (err) {
      console.error('Erreur lors de la récupération des articles:', err);
      setError('Impossible de charger les articles. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // Mock data pour le hero (sera remplacé par le premier article s'il existe)
  const heroData = articles[0] ? {
    title: articles[0].title,
    description: articles[0].summary,
    imageUrl: articles[0].image_url
  } : {
    title: "Chargement...",
    description: "Veuillez patienter...",
    imageUrl: ""
  };

  const trendingTopics = [
    "Presidential Elections",
    "Economic Growth",
    "Cultural Heritage",
    "National Team",
    "Regional Integration"
  ];

  // Unused mock data (kept for reference)
  /* const topStories = [
    {
      title: "Political Rally Draws Massive Crowd",
      description: "Thousands gather in Abidjan to support various political factions.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBetw8Nh2lKOC8c145SnR7xbKgVpMlVm5rutkMi4zHMTGCc0JawsYaPHuhz5Y7MgpP79AnJdMCc6eyVBXnsLzl4JBAv7CH_ewAr-PuT6Y4KmjyGYaL6YzuHEiT2NL9A2YtqiOXC_eKNFc6X9TAUKluKYdL8YIhDBo7gFodKsOmuV9YgX42C4ry-GpPkjOofDpcSWwKOLCiGuTXUXGCiLW1jiryfpw8OB-vI67MNDi_rNrpNkC8NoasnUYjulURhA4xO9-CeG8eDqYDq"
    },
    {
      title: "Economic Forum Highlights Growth Opportunities",
      description: "Experts discuss strategies for sustainable development and job creation.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAiOQ2LJqF20V8rupG6Wf2ZNh_q9ZS4hxGHIqGOqeICHstllnMndjpvWskR_MFjjuOOezZgEtE5Mnjdu6N_2nT4zAQjO4X53Okmbelk18VUbv_BAHmSN1GUejuU4wf4C__gk27sRpdADOpZ4KsGhCTvKGeOHWJKh_WQdt3yGg14jyvZEEa1p-IJRI4cHlRCEyhWtELXMDl_DkJK3XKvscZopHEQqeMuoaLiXqPW44fnslgJnKZQgMVEJKGuzKUyT8fyzlLV26qJWaI"
    },
    {
      title: "Cultural Festival Showcases Ivorian Heritage",
      description: "Traditional dances, music, and art celebrate the country's rich cultural diversity.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBNXQ_5yBQ2RXXXZpQGjjWS70OTKulNqe6gAQZQt9JSBaNwrdmjGItcVkyjhvBlRF3PSWpyH1zXeo13zUegogZjJHmyyt6E0gfZm0mgoAbox68BAtBKq-SvlVl33PErcRJLdVr8Ts-pSldJ1O2ClTBrbAQqKcUgTTMSj0MTYrkwwsuxbZfEEpBAxhnMXZTG_GagA4mhYvSfrsUwH8Yhp1OutZgebBZ8eIoUKn2r-oejcSI59RA2fjXz5J84vTUEaBAil0Bsv8J5x-3N"
    },
    {
      title: "National Team Wins Crucial Match",
      description: "The Elephants secure a vital victory in their World Cup qualifying campaign.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVQH9hB6SYDCqNcfv9vayV1ensTq-Es3EpsQvlV3UwQqxX7bUYFZ5mJ5g5LlVNT7RFsQyG2ELPnFQPqlRKXrnveD72rKwbv9P_Eo4QdVfwLYekXvUX-6RWVT0WVy4e-x-K-OVSz7-wJsDlhSObNp9cKl51aJFctCISiv3D7sLVPmd7kipbFHa5Dp8x6-HvXpWTSSE6s0FyahEoSbyqs2piySQ8sk4bjZqaU59wEeRyPSu-H1KP0z0L6m2_WFdFCa1Dkj7j5UlEy7cC"
    },
    {
      title: "African Leaders Discuss Regional Integration",
      description: "Heads of state from across the continent meet to strengthen cooperation.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAirTKclpeqWB8ROxwaUyahm3OEkx9YEXq21R7UAjY3GOjuHP0GEj9CDBcOmHuN4UsRnoVHtRD3ij_ZVzicaAfCg27QjSG7XkoiocOIyeaCdwa9gQ7OlJeBDm5mpeDoGlfzIghbrGK1gVAAiNLliHoiXDwn6jiEx19gGh6epZI_H0Ce-TNV9bNi3JK3krHCfe_uHAg54-nkkyFsKKOIbx7nu-EtJNbHHDl3ifMbSe8YZ9D_hRJ96QSO2QRndGjds1lRM9CjGQgb-_4o"
    }
  ];

  const politicsArticles = [
    {
      title: "Government Announces New Economic Policies",
      description: "The government unveils a series of measures aimed at boosting economic growth and attracting foreign investment.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGo0DrWmKTJfYTIlbODnDvO2f_QHwK-7H-0_-Kucuw2Gw5nksEXbCXjqbaLOtnNDkFSpT6sI82JAgwfAMBhV5rxKDPtmYLG-jgUdW3fxoUJkKMlECsAKEWMoGr_-sNdE9oeJUX7h_eQrK4lindx1xpJBrWnmp0qNQS7wFKjdcLgIMepfewakd51VNJQsnUMZhoNowkBDncFIFrnqmPU4Ggjfs2LYuSgby_Rm8exY036M3Gg8HAife9eCkZM4aOEW2WU8FvB5HYVCR1"
    },
    {
      title: "Opposition Parties Criticize Recent Legislation",
      description: "Opposition leaders express concerns over the potential impact of the new laws on civil liberties.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA2lO83IaeI-XjoxmAjjaUslzqYlRBcDcZXurm8uZfp1KGpGExrnBBGvFVnb1xw1IXHszVWngA9j6LqPBy8bTm1yGDIFkM6gpb0hlCJO9nQ33Ll9Mhcp6N7uo9e9QKlMliZheykherOvqUBIYsXJ1tKAOLsjdrE4AkrZAb4Uzl7UTgz_1akkGbVS8Povu08371eWxTYj8VibrHjXlfFTCJ5JWW7hmEPmcvMn7DxfrDYZ9o9R6VBgjOvoATwvrMe1Qu4MAm5S75jK7Eh"
    },
    {
      title: "Parliament Debates Key Reforms",
      description: "Lawmakers engage in a heated debate over proposed changes to the electoral code.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4ubR9tAAJAqF81JCwgipt9VDTYMrQ7IesdUWZ3jbZDkx5Tr9amhwrRy2rTz-w1fr6CFLkNobNkEnUqQZB5wXWg8t9e6S0Ebr1xTajZgeUBgF5c5smIn7DNhRHLndt9a0frsUNLKtgmyEQeOCW8hXhemYoQXtrnxaWdsC6FsYkmeacl4GCgmfmmopvFL-nccKPRB0pig8wS_4UyvaWfzmTCbQYUnYCNX6tSo3r55Fn15v8J9p6ZXU5tN5jel0kFLc7SJ_yvVqPfmuR"
    },
    {
      title: "Local Elections See High Voter Turnout",
      description: "Voters across the country participate in local elections to choose their representatives.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZQt78qT_3Rr7ph64WFbWNkbe3ndoLcinEjkGhjGBW8mn1uNQ4290HAWbOtJ6yxMVmHLGyLE541R-DfAf7fvK31_o-cktdBhyVVJ6qep9IIR-mTPQQ8T6-t0i-Nqgpe4q6_19XD-HrMho4_UYxyBQ8zTfuwW1fS3CnNUA5zJrVPKMFabaO1RgU4JroZlyP2QY-D412LiiWEzvZG5T5TYrtH75TJePDUYIpGOK6lAlN-voarEUZSGCCNFn6QPaNrQMLwgzmWWNiz9qP"
    }
  ];

  const economyArticles = [
    {
      title: "Cocoa Prices Reach Record Highs",
      description: "Favorable weather conditions and increased demand drive cocoa prices to unprecedented levels.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDiq0HoPrEGYxGolkEViOW9-8GY_qq8BLXY49pHu1ADMPai6HntWv3PH08xlDR8KgAVVwgBYlojvFxXwGmluvVXCkprhNYgzFyRLfeucU-4gTnhrY4_s00xNd1Np1fIVsuSw8-mEgVF4sknjOOKmaL3s3i2pQAPsUYYnfu4Kk6O8NY5ROxgeML9bmTw8ARMkThQSoFxaGkAl-1sTHKPghPekxQYURyZ2QXe7CBqWgCKzkmFaXW5d6oD-jjZf3OJtQMZwq_Iuzeg06KK"
    },
    {
      title: "New Infrastructure Projects Launched",
      description: "The government initiates several large-scale infrastructure projects to improve transportation.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEOkj3oz74oAolLi0gA2YgpDbK_3hkKl7x3y1LEKONOk3IhyRcIapnIbUMt90INH808lm-G7ruIOk1-6ifKVWQmhBGMd3_Xwi2bi0ouhofIHtpLJ6j-SfGS1DOk3uXIIFGRxFSxDezY_XKniKXVCcOCPgJO0_WasNEJFnEYFjrnIy0QugfPFGJg_6JIWUg-_6_aaNf3upMTfgpVwMj6xCE0wAyfAp7UJ7FAe0x4l5p9b_ezN1Bslp9d_bBiZFf_pQCx0-Qrc7-XgSc"
    },
    {
      title: "Tourism Sector Shows Signs of Recovery",
      description: "The tourism industry experiences a resurgence as travel restrictions ease and visitor confidence grows.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBpVgL5Tw6fxWKO969XMxMbA8P5TIlHeNI8MGmc0zw2Gxjx97PNx0qaGc0px4ArgjT05z16uEs_SmZgwGSYz9siCvOkvU3E9bYwZ-jCr6otJUeJRUk4yFb-gnx6SRRwP_1SAPfr2DDc9bDDDen4S2bl9r9Y4gZMt_8ciMOD2sQ0BpoklZzee3E4vWR0CO5cFvMC-w0i7c0-majjpM7dfmByWm9e3JxgWQX1FcKLteW3PqlanlKQb1Qy_8NgkfJbkFwZSnA9w46Hp_uC"
    },
    {
      title: "Unemployment Rate Declines",
      description: "Official statistics indicate a decrease in the unemployment rate, signaling positive economic trends.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAe2Fpk-WBfr_itR30sbJT26y0CIhH5m0qXeFPocfEgt-RJGn5wPNGDDzKiT6GZQSEK335smnQy1zJnEIfRGfHGLmOt4-yh1noqwklo00cKVer1EMUDaXUHNXREaJCjgPBWmAeAE1KdjhSrYxPyQCPflBf2d0jlMkpljNZrY3Akx1mutQkdLoOFoyQGPdBfWyh70Fha6jOt_hMGpcyvMH4JdIdoVFRtcAW0SWpjb8JP0My7aObonIovX2SmE6Ue0h-olTyO99uXm55d"
    }
  ];

  const opinionArticles = [
    {
      title: "The Future of Ivorian Politics",
      description: "A leading political analyst discusses the key challenges and opportunities.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuChpJ4cL0eeRgTtpvyQtN5GN8wx2vQaFzvfqwu9eChO56j3OY8RTxtrYwJJICfmScmXlNc_Nes6Ws5wjP5G6FLQfZxRcn5wcZY4EEm-gDwmoglvkG5O1S03RfQpo8PpGPopOrRnCXrJznAYfB7AUuJU45YokaRzZWLLgxTBWHXk6AIdQByvpuEXIkx1HMkpXwv0e48gh-bSVCnBJnqEsDN_sn-Jw9rV46J5DpPCCsLBpvKplifBB-iNayNPQCaA9bk1pQd0d1Fd2CU8"
    },
    {
      title: "Investing in Education for a Brighter Tomorrow",
      description: "An education expert argues for increased investment in education.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDssw5rlhWr6V1cpuSsBXS_ybuVEqenwC9tsY_349fhmlhtPxFpF5Gkffk09uBW-gMJrfBGe4gcekF5SQdTiw13TaUQYjGP7I960_xwRZCYrP4fu6NVoyp_JH1y8QoFjx1QkzU5KwxR9b4-QcZ9boD6YTRKxh-vt1lh44kAEe-3nG7BNyHb-Oemv4wCa05nHf__axh82C1lr_KmcxND0UYFYAd7eYwINjaSOJH_www1ZbZzvFY5Ajq_df2lrm8XdkiTH5UC0kkhp-1S"
    },
    {
      title: "The Role of Culture in National Development",
      description: "A cultural commentator explores the importance of Ivorian culture.",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7Cof27ZT6hmJkSJG7gO4iU3dtHixnLNCJd2HiGQYFPidnWgaFEohHM-7nN1v1uFRZ1-1LF00xvQD5Lm1AjQRZ3GFrsGV61fUriPP_T70nkEhk0vmzdIJ1vP08qKHzi40AzTeIyraBsnzCRo-D-z7xUU2Mkv9HX67o8_5v1j-hllMk6yQO3MJ8vqry7oJnZp02W5xFMDuHdtdLeJ0bRqTXf90oAvEQHcjiL-wQ0Bj44k_bGUKHHeY0UOdXSpAViD40jyLyy6Ri2LBv"
    }
  ]; */

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center px-10 py-8">
        <div className="text-center">
          <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-lg text-black dark:text-white">Chargement des articles...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-1 items-center justify-center px-10 py-8">
        <div className="text-center">
          <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={fetchArticles}
            className="mt-4 rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
          >
            Réessayer
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 justify-center px-10 py-8">
          <div className="flex w-full max-w-7xl flex-col gap-12">
            {/* Hero Section */}
            {articles.length > 0 && (
              <Hero
                title={heroData.title}
                description={heroData.description}
                imageUrl={heroData.imageUrl}
              />
            )}

            {/* Articles Section */}
            <section className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-black dark:text-white">Derniers Articles</h2>
              {articles.length === 0 ? (
                <p className="text-center text-black/60 dark:text-white/60">
                  Aucun article disponible pour le moment.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {articles.slice(1).map((article) => (
                    <ArticleCard
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      description={article.summary}
                      imageUrl={article.image_url}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Politics + Trending Topics Grid */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
              {/* Politics Section - Placeholder for future filtering */}
              <section className="flex flex-col gap-6 lg:col-span-2">
                <h2 className="text-3xl font-bold text-black dark:text-white">Politique</h2>
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {articles
                    .filter(a => a.category === 'politique')
                    .slice(0, 4)
                    .map((article) => (
                      <ArticleCard
                        key={article.id}
                        id={article.id}
                        title={article.title}
                        description={article.summary}
                        imageUrl={article.image_url}
                      />
                    ))}
                  {articles.filter(a => a.category === 'politique').length === 0 && (
                    <p className="col-span-2 text-center text-black/60 dark:text-white/60">
                      Aucun article politique disponible.
                    </p>
                  )}
                </div>
              </section>

              {/* Sidebar */}
              <aside className="flex flex-col gap-6">
                <h2 className="text-3xl font-bold text-black dark:text-white">Sujets Tendances</h2>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic, index) => (
                    <a
                      key={index}
                      className="rounded-full bg-black/5 px-3 py-1 text-sm font-medium text-black/80 transition-colors hover:bg-primary/20 dark:bg-white/5 dark:text-white/80 dark:hover:bg-primary/30"
                      href="#"
                    >
                      {topic}
                    </a>
                  ))}
                </div>

                <h2 className="pt-6 text-3xl font-bold text-black dark:text-white">Opinion</h2>
                <div className="flex flex-col gap-6">
                  {articles
                    .filter(a => a.category === 'opinion')
                    .slice(0, 3)
                    .map((article) => (
                      <article key={article.id} className="group flex items-start gap-4">
                        <div
                          className="h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat"
                          style={{ backgroundImage: `url("${article.image_url}")` }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-primary">Opinion</p>
                          <h3 className="font-bold text-black group-hover:text-primary dark:text-white dark:group-hover:text-primary">
                            {article.title}
                          </h3>
                          <p className="text-sm text-black/60 dark:text-white/60">{article.summary}</p>
                        </div>
                      </article>
                    ))}
                  {articles.filter(a => a.category === 'opinion').length === 0 && (
                    <p className="text-center text-sm text-black/60 dark:text-white/60">
                      Aucun article d'opinion disponible.
                    </p>
                  )}
                </div>
              </aside>
            </div>

            {/* Economy Section */}
            <section className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold text-black dark:text-white">Économie</h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {articles
                  .filter(a => a.category === 'economie')
                  .slice(0, 4)
                  .map((article) => (
                    <ArticleCard
                      key={article.id}
                      id={article.id}
                      title={article.title}
                      description={article.summary}
                      imageUrl={article.image_url}
                    />
                  ))}
                {articles.filter(a => a.category === 'economie').length === 0 && (
                  <p className="col-span-4 text-center text-black/60 dark:text-white/60">
                    Aucun article économique disponible.
                  </p>
                )}
              </div>
            </section>
          </div>
    </main>
  );
};

export default HomePage;
