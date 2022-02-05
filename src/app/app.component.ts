import { HttpErrorResponse } from '@angular/common/http';
import { IfStmt } from '@angular/compiler';
import { Component,OnInit } from '@angular/core';
import { ClockService } from 'src/clock.service';
import { CountriesService } from 'src/countries.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CountriesApp';


  public countries: any
  public countryInfo: any
  public currentLanguages: string[]=[]
  public currentCurrencies: string[]=[]
  public currentNeighbours: any[]=[]
  public copyCountries: any[]=[]
  public populationLeft: number=0
  public populationRight: number=0
  public continentFilters:string[]=[]
  public languagesFilters:string[]=[]
  public currenciesFilters:string[]=[]
  public allTimezones:string[]=[]
  public checkedTimezone: boolean=false;
  public timezoneFilters:string[]=[]
  public currentClock: string=''
  

  constructor(private countriesService: CountriesService,private clockService:ClockService){ }


  ngOnInit(){
       
        this.getCountries();
        
       
        
       
  }
  public getCountries()
  {
    
    this.countriesService.getAllCountries().subscribe(
      (res : any) =>{
        this.countries = res.sort((a: any, b:any) => (a.name.common > b.name.common) ? 1 : -1)
        this.copyCountries=res;
        console.log(this.countries);
      },
      (err : HttpErrorResponse) =>{
        console.log(err);
      }
      
      )
  }
  public getClock()
  {
    this.clockService.getClock(this.countryInfo.continents,this.countryInfo.capital).subscribe(
      (res:any)=>{
        this.currentClock=res.datetime;
        console.log(this.currentClock);
      },
      (err: HttpErrorResponse)=>{
        console.log(err);
      }
    )
  }
  public searchCountry(key: string)
  {
    const searchedCountries=[]
      for(const sCountries of this.countries)
      { 
        if(sCountries.capital != undefined )
          if(sCountries.name.common.toLowerCase().indexOf(key.toLowerCase())!= -1 || sCountries.capital[0].toLowerCase().indexOf(key.toLowerCase())!= -1 || sCountries.cca3.toLowerCase().indexOf(key.toLowerCase())!= -1 )
             searchedCountries.push(sCountries);
        
          
        
        
      }
    this.countries=searchedCountries;
    if(this.countries.length==0 || key=='')
      {
      
        this.getCountries();

      }
     
    
  }
  public getCurrencies(country: any)
  {
    this.currentCurrencies=[];
    const keys=Object.keys(country.currencies);
    for (const key in keys){
      
      this.currentCurrencies.push(country.currencies[`${keys[key]}`].name)
    }
  }
 
  public clickCard(country: any)
  { 
    
    this.countryInfo=country;
    this.currentLanguages=[]
    const keys=Object.keys(country.languages)
    
    for (const key in keys){
      
      this.currentLanguages.push(country.languages[`${keys[key]}`])
    }
    
    this.getCurrencies(country);
    this.getNeighbours(country.borders);
    this.getClock();
    
    
    
    
  }

  public getNeighbours(neighboursAbbreviation: string[])
  {
    
    this.currentNeighbours=[];
    if(neighboursAbbreviation!=undefined)
    neighboursAbbreviation.forEach( na => {
      for(const cntry of this.copyCountries)
      {
        if (na == cntry.cca3)
        {
          this.currentNeighbours.push(cntry);
          break;
          
        }
      }
    })
    
  }
  public neighbourClick(neighbour: any){

    /*document.getElementById('closeModal')?.click();*/
    this.clickCard(neighbour);
    
    
  }
  public clickFilters()
  {
    this.getAllTimezone();
        
    
  }
  public saveFilters(popLeft:number,popRight:number,europeChoice: any,asiaChoice:any,africaChoice:any,nAmericaChoice:any,sAmericaChoice:any,
    oceaniaChoice:any,antarticaChoice:any,englishChoice:any,spanishChoice:any,frenchChoice:any,portugueseChoice:any,germanChoice:any,
    arabicChoice:any,euroChoice:any,usdChoice:any,gbpChoice:any,jpyChoice:any,audChoice:any)
  {
    
   ///filters for continent
    this.continentFilters=[];
    if(europeChoice == true)
      this.continentFilters.push('Europe')
    if(asiaChoice == true)
      this.continentFilters.push('Asia')
    if(africaChoice == true)
      this.continentFilters.push('Africa')
    if(nAmericaChoice == true)
      this.continentFilters.push('North America')
    if(sAmericaChoice == true)
      this.continentFilters.push('South America')
    if(oceaniaChoice == true)
      this.continentFilters.push('Oceania')
    if(antarticaChoice == true)
      this.continentFilters.push('Antarctica')
    
    ///filters for language
    this.languagesFilters=[]
    if(englishChoice == true)
      this.languagesFilters.push('English')
    if(spanishChoice == true)
      this.languagesFilters.push('Spanish')
    if(frenchChoice == true)
      this.languagesFilters.push('French')
    if(portugueseChoice == true)
      this.languagesFilters.push('Portuguese')
    if(germanChoice == true)
      this.languagesFilters.push('German')
    if(arabicChoice == true)
      this.languagesFilters.push('Arabic')

    ///filters for currencies
    this.currenciesFilters=[]
    if(euroChoice == true)
      this.currenciesFilters.push('Euro')
    if(usdChoice == true)
      this.currenciesFilters.push('United States dollar')
    if(gbpChoice == true)
      this.currenciesFilters.push('British pound')
    if(jpyChoice==true)
      this.currenciesFilters.push('Japanese yen')
    if(audChoice==true)
      this.currenciesFilters.push('Australian dollar')

    console.log(this.currenciesFilters)
    this.populationLeft=popLeft;
    this.populationRight=popRight;
    if(this.populationLeft!= null && this.populationRight!= null)
      this.filterPopulation(this.populationLeft,this.populationRight);

    console.log(this.countries);
    if(this.continentFilters.length>0)
      this.filterContinents(this.continentFilters)
    console.log(this.countries);
    if(this.languagesFilters.length>0)  
      this.filterLanguages(this.languagesFilters)
    if(this.currenciesFilters.length>0)
      this.filterCurrencies(this.currenciesFilters)
    if(this.timezoneFilters.length>0)
      this.filterTimezone(this.timezoneFilters);
    if(this.continentFilters.length==0 && (this.populationLeft == this.populationRight) && this.languagesFilters.length==0 && this.currenciesFilters.length==0 && this.timezoneFilters.length==0)
      this.getCountries()
    
    
  }
  public filterPopulation(minPopulation:number,maxPopulation:number)
  {
    const filteredCountries=[]
    for (const country of this.copyCountries)
    {
      if (country.population >= minPopulation && country.population <= maxPopulation)
        filteredCountries.push(country);
    }
    this.countries=filteredCountries;

  }

  public filterTimezone(tzones: string[])
  {
    const filteredCountries=[]
    if( (this.populationLeft ==null && this.populationRight==null )|| (this.populationLeft==0 && this.populationRight==0) && this.continentFilters.length==0 && this.languagesFilters.length==0)
      this.countries=this.copyCountries;
    for(const country of this.countries)
    {
      if(this.hasSubArray(tzones,country.timezones))
        filteredCountries.push(country);
    }
    this.countries=filteredCountries;
    
  }



  public filterContinents(continents: string[])
  {
    const filteredCountries=[]
    if(this.populationLeft ==null && this.populationRight==null || this.populationLeft==0 && this.populationRight==0)
      this.countries=this.copyCountries;
    for (const country of this.countries)
    {
      
      if (this.hasSubArray(continents,country.continents))
        filteredCountries.push(country)
        
    }
    console.log(filteredCountries);
    this.countries=filteredCountries;
  }
  public filterLanguages(languages: string[])
  {
    const filteredCountries=[]
    if( (this.populationLeft ==null && this.populationRight==null )|| (this.populationLeft==0 && this.populationRight==0) && this.continentFilters.length==0)
      this.countries=this.copyCountries;
    for(const country of this.countries)
    {
      if(this.hasSubArray(languages,this.getLanguages(country)))
        filteredCountries.push(country)
    }
    console.log(filteredCountries);
    this.countries=filteredCountries;

  }
  public getLanguages(country: any): string[]
  {
    
    const countryLanguages:string[]=[]
    let keys: string[]=[]
    if(country.languages !=null && countryLanguages!=undefined)
       keys=Object.keys(country.languages)
    if(keys )
    for (const key of keys){
      
      countryLanguages.push(country.languages[`${key}`])
    }
    return countryLanguages;
  }
  public filterCurrencies(currencies:string[])
  {
    const filteredCountries=[]
    if( (this.populationLeft ==null && this.populationRight==null )|| (this.populationLeft==0 && this.populationRight==0) && this.continentFilters.length==0 && this.languagesFilters.length==0)
      this.countries=this.copyCountries;
      for(const country of this.countries)
      {
        
        if(this.hasSubArray(currencies,this.getCountryCurrencies(country)))
          filteredCountries.push(country)
      }
      console.log(filteredCountries);
      this.countries=filteredCountries;   

  }
  public getCountryCurrencies(country: any): string[]
  {
    
    const countryCurrencies:string[]=[]
    let keys: string[]=[]
    if(country.currencies !=null && countryCurrencies!=undefined)
       keys=Object.keys(country.currencies)
    if(keys )
    for (const key of keys){
      
      countryCurrencies.push(country.currencies[`${key}`].name)
    }
    return countryCurrencies;
  }
  public getAllTimezone()
  {
    
    for( const country of this.copyCountries)
    {
      
      for(const tz of country.timezones)
      {
        
        if(this.contains(tz,this.allTimezones)==false)
          this.allTimezones.push(tz);
      }
    }
    
  }

  public onCheckboxChange(event:any)
  {
    
    if(event.target.checked==true)
    
      this.timezoneFilters.push(event.target.value);
      
    

    if(event.target.checked==false)
       { 
         const index=this.timezoneFilters.indexOf(`${event.target.value}`)
         if (index > -1)
         {
           this.timezoneFilters.splice(index,1)
         }
         
        }
      
  }
    public hasSubArray(master: string[], sub: string[]):boolean
    {
        for (const m in master)
        {
          for(const s in sub)
          {
            if (master[m] == sub[s])
              return true
          }
        }
        return false
    
    }
    public contains(str: string,arr:string[]): boolean
    {
      for(const el of arr)
      {
        if(el == str)
          return true;
      }
      return false
    }
  
}

