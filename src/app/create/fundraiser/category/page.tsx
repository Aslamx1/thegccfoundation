'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, ArrowRight, MapPin, Search } from 'lucide-react';

const countryCodes = `
AF AL DZ AS AD AO AI AQ AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BV BR IO BN BG BF BI CV KH CM CA KY CF TD CL CN CX CC CO KM CG CD CK CR HR CU CW CY CZ CI DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF TF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT HM VA HN HK HU IS IN ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KP KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RO RU RW RE BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA GS SS ES LK SD SR SJ SE CH SY TW TJ TZ TH TL TG TK TO TT TN TM TC TV TR UG UA AE GB US UM UY UZ VU VE VN VG VI WF EH YE ZM ZW AX
`.trim().split(/\s+/);

type CountryOption = { code: string; name: string };


export default function FundraiserLocationPage() {
  const [country, setCountry] = useState('Uganda');
  const [countries, setCountries] = useState<CountryOption[]>([]);

  useEffect(() => {
    let regionNames: Intl.DisplayNames | undefined;
    try {
      regionNames = typeof Intl.DisplayNames === 'function'
        ? new Intl.DisplayNames(['en'], { type: 'region' })
        : undefined;
    } catch {
      regionNames = undefined;
    }
    const fallbackNames: Record<string, string> = { UG: 'Uganda', US: 'United States', GB: 'United Kingdom', KE: 'Kenya', TZ: 'Tanzania', RW: 'Rwanda', CA: 'Canada', AU: 'Australia', IN: 'India', NG: 'Nigeria', ZA: 'South Africa', FR: 'France', DE: 'Germany', IT: 'Italy', ES: 'Spain', JP: 'Japan', CN: 'China', BR: 'Brazil', AE: 'United Arab Emirates' };
    setCountries(countryCodes
      .map((code) => ({ code, name: regionNames?.of(code) ?? fallbackNames[code] ?? code }))
      .sort((a, b) => a.name.localeCompare(b.name)));
  }, []);
  const [district, setDistrict] = useState('');
  const [error, setError] = useState('');
  const [countryMenuOpen, setCountryMenuOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const filteredCountries = useMemo(() => {
    const query = countrySearch.trim().toLocaleLowerCase();
    if (!query) return countries;
    return countries.filter(({ name, code }) =>
      name.toLocaleLowerCase().includes(query) || code.toLocaleLowerCase().includes(query)
    );
  }, [countries, countrySearch]);

  const selectedCountry = countries.find((item) => item.name === country);
  const selectedCountryCode = selectedCountry?.code.toLowerCase() ?? 'ug';

  function handleContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const location = district.trim();
    if (!location) {
      setError('Enter the district or city where the fundraiser will be based.');
      return;
    }
    const params = new URLSearchParams({ country, district: location });
    window.location.assign(`/create-campaign?${params.toString()}`);
  }

  return (
    <main className="min-h-[calc(100vh-72px)] bg-white">
      <header className="flex h-[72px] items-center justify-between border-b border-[#e8ebe8] px-5 sm:px-10">
        <Link href="/" aria-label="GCC Foundation home">
          <Image src="/images/gcc-logo-full.jpg" alt="GCC Foundation" width={180} height={50} priority className="h-10 w-auto object-contain" />
        </Link>
        <Link href="/sign-in" className="rounded-full px-4 py-2 text-sm font-semibold text-[#20251f] hover:bg-[#f4f7f4]">Sign in</Link>
      </header>

      <section className="mx-auto flex w-full max-w-xl flex-col px-5 pb-16 pt-12 sm:pt-20">
        <div className="mb-8 flex items-center gap-2 text-sm font-semibold text-[#287348]">
          <MapPin className="h-4 w-4" /> Step 1 of 5
        </div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#20251f] sm:text-4xl">Where are they located?</h1>
        <p className="mt-3 text-base leading-relaxed text-[#626b64]">Choose where the person or community you’re supporting is based. This helps us guide you through the right fundraiser setup.</p>

        <form onSubmit={handleContinue} className="mt-9 space-y-6">
          <div>
            <label id="country-label" className="mb-2 block text-sm font-semibold text-[#20251f]">Country</label>
            <div className="relative">
              <button
                type="button"
                aria-labelledby="country-label"
                aria-haspopup="listbox"
                aria-expanded={countryMenuOpen}
                onClick={() => { setCountryMenuOpen((open) => !open); setCountrySearch(''); }}
                onKeyDown={(event) => { if (event.key === 'Escape') setCountryMenuOpen(false); }}
                className="flex h-14 w-full items-center justify-between rounded-xl border border-[#cfd6d0] bg-white px-4 text-left text-base text-[#20251f] hover:border-[#02a95c] focus:outline-none focus:ring-4 focus:ring-[#02a95c]/10"
              >
                <span className="flex items-center gap-3">
                  <Image src={'https://flagcdn.com/' + selectedCountryCode + '.svg'} alt="" width={28} height={20} unoptimized className="h-5 w-7 rounded-[2px] object-contain" />
                  <span>{country}</span>
                </span>
                <ArrowDown className="h-4 w-4 text-gray-500" />
              </button>

              {countryMenuOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-[#dfe5df] bg-white shadow-xl">
                  <div className="border-b border-[#e8ebe8] p-3">
                    <label htmlFor="country-search" className="sr-only">Search countries</label>
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        id="country-search"
                        type="search"
                        autoComplete="off"
                        value={countrySearch}
                        onChange={(event) => setCountrySearch(event.target.value)}
                        placeholder="Search countries"
                        className="h-11 w-full rounded-xl border border-[#dfe5df] pl-10 pr-3 text-sm focus:border-[#02a95c] focus:outline-none focus:ring-4 focus:ring-[#02a95c]/10"
                      />
                    </div>
                  </div>
                  <div role="listbox" aria-labelledby="country-label" className="max-h-72 overflow-y-auto p-1.5">
                    {filteredCountries.length ? filteredCountries.map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        role="option"
                        aria-selected={item.name === country}
                        onClick={() => { setCountry(item.name); setCountryMenuOpen(false); setCountrySearch(''); }}
                        className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-[#f4f7f4] ${item.name === country ? 'bg-[#f4f7f4] font-semibold text-[#087443]' : 'text-[#20251f]'}`}
                      >
                        <Image src={'https://flagcdn.com/' + item.code.toLowerCase() + '.svg'} alt="" width={28} height={20} loading="lazy" unoptimized className="h-5 w-7 shrink-0 rounded-[2px] object-contain" />
                        <span className="flex-1">{item.name}</span>
                        <span className="text-xs text-gray-400">{item.code}</span>
                      </button>
                    )) : (
                      <p className="px-3 py-6 text-center text-sm text-gray-500">No countries match that search.</p>
                    )}
                  </div>
                  <p className="border-t border-[#e8ebe8] px-4 py-2 text-xs text-gray-500">{countryCodes.length} countries and territories</p>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">Choose the country or territory where the beneficiary is located.</p>
          </div>

          <div>
            <label htmlFor="district" className="mb-2 block text-sm font-semibold text-[#20251f]">District or city</label>
            <input id="district" autoComplete="address-level2" value={district} onChange={(event) => { setDistrict(event.target.value); setError(''); }} placeholder="For example, Kampala" className="h-14 w-full rounded-xl border border-[#cfd6d0] bg-white px-4 text-base text-[#20251f] placeholder:text-gray-400 focus:border-[#02a95c] focus:outline-none focus:ring-4 focus:ring-[#02a95c]/10" aria-invalid={Boolean(error)} aria-describedby={error ? 'location-error' : undefined} />
            {error && <p id="location-error" role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
          </div>

          <button type="submit" className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#02a95c] px-6 text-base font-bold text-white hover:bg-[#087443] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#02a95c]/40">
            Continue <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-gray-500">You can review your fundraiser details before publishing.</p>
      </section>
    </main>
  );
}



